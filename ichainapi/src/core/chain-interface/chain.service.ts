import {HttpException, HttpStatus, Injectable, Provider} from '@nestjs/common';
import {HlfErrors, HlfInfo} from './logging.enum';
import {HlfConfig} from './hlfconfig';
import {
    ChaincodeInvokeRequest,
    ChaincodeQueryRequest,
    IKeyValueStore,
    ProposalResponseObject,
    User
} from 'fabric-client';
import {Log} from '../../common/utils/logging/log.service';
import Client = require('fabric-client');
import * as fs from "fs";
import {HlfClient} from "./hlfclient";

@Injectable()
export abstract class ChainService {

    // TODO: refactor

    protected constructor(public hlfConfig: HlfConfig) {
    }

    /**
     * Wrapper around the newDefaultKeyValueStore function
     *
     * @param {string} walletPath
     * @returns {Promise<IKeyValueStore>}
     */
    protected newDefaultKeyValueStore(walletPath: string): Promise<IKeyValueStore> {
        Log.hlf.info(HlfInfo.CREATING_CLIENT);
        return Client.newDefaultKeyValueStore({path: walletPath});
    }

    /**
     * Wrapper around the getUserContext function
     *
     * @param {string} userId
     * @returns {Promise<User>}
     */
    protected getUserContext(userId: string): Promise<User> {
        return <Promise<User>>this.hlfConfig.client.getUserContext(userId, true);
    }

    /**
     * Check if a user is enrolled
     *
     * @param user
     * @returns {boolean}
     */
    protected isUserEnrolled(user): boolean {
        Log.hlf.info(HlfInfo.CHECK_USER_ENROLLED);
        if (user === undefined || user == null || user.isEnrolled() === false) {
            Log.hlf.error(HlfErrors.NO_ENROLLED_USER);
            return false;
        }
        Log.hlf.info(HlfInfo.USER_ENROLLED, user);
        return true;
    }

    protected handleError(err): Promise<any> {
        Log.hlf.error(err);
        throw err;
    }

    /**
     * Create new query transaction
     *
     * @param {string} requestFunction
     * @param {string[]} requestArguments
     * @param {string} chaincodeId
     * @param transientMap
     * @returns {Promise<Buffer[]>}
     */
    protected newQuery(requestFunction: string, requestArguments: string[], chaincodeId: string, transientMap?: Object): Promise<Buffer[]> {
        const request: ChaincodeQueryRequest = {
            chaincodeId: chaincodeId,
            fcn: requestFunction,
            args: requestArguments,
            transientMap: transientMap
        };
        return this.hlfConfig.channel.queryByChaincode(request);
    }

    /**
     * Get the details of a given transaction id.
     *
     * @param {string} transactionId
     * @returns {Promise<Buffer[]>}
     */
    protected newTransactionQuery(transactionId: string): Promise<Buffer[]> {
        return this.hlfConfig.channel.queryTransaction(transactionId);
    }

    /**
     * Get actual reponse from response buffers
     *
     * @param {Buffer[]} queryResponses
     * @returns {object}
     */
    protected getQueryResponse(queryResponses: Buffer[]): object {
        if (!queryResponses.length) {
            Log.hlf.debug(HlfInfo.NO_PAYLOADS_RETURNED);
        } else {
            if (queryResponses[0] instanceof Error) {
                return this.handleError(queryResponses[0].toString());
            }
        }
        Log.hlf.debug(HlfInfo.RESPONSE_IS, queryResponses[0].toString());

        if (!queryResponses[0].toString().length) {
            return null;
        }

        return JSON.parse(queryResponses[0].toString());
    }

    /**
     * Create and send new invoke transaction proposal
     *
     * @param {string} requestFunction
     * @param {string[]} requestArguments
     * @param {string} chaincodeId
     * @param transientMap
     * @returns {Promise<{txHash: string; buffer: ProposalResponseObject}>}
     */
    protected sendTransactionProposal(requestFunction: string, requestArguments: string[], chaincodeId: string, transientMap?: Object): Promise<{ txHash: string; buffer: ProposalResponseObject }> {
        const txId: any = this.hlfConfig.client.newTransactionID();
        Log.hlf.debug(HlfInfo.ASSIGNING_TRANSACTION_ID, txId._transaction_id);

        let request: ChaincodeInvokeRequest = {
            targets: this.hlfConfig.targets,
            chaincodeId: chaincodeId,
            fcn: requestFunction,
            args: requestArguments,
            transientMap: transientMap,
            txId: txId
        };

        return this.hlfConfig.channel.sendTransactionProposal(request)
            .then(proposalResponse => {
                return {txHash: txId._transaction_id, buffer: proposalResponse};
            });
    }

    /**
     * Check if the proposal response is good
     *
     * @param {ProposalResponseObject} results
     * @returns {boolean}
     */
    protected isProposalGood(results: ProposalResponseObject): boolean {
        let proposalResponses = results[0];
        let goodCount = 0, badCount = 0;

        proposalResponses.forEach(proposalResponse => {
            if (proposalResponse && proposalResponse.response &&
                proposalResponse.response.status === 200) {
                goodCount++;
                Log.hlf.debug(HlfInfo.GOOD_TRANSACTION_PROPOSAL);
            } else {
                badCount++;
                Log.hlf.error(HlfErrors.BAD_TRANSACTION_PROPOSAL, badCount);
                // console.log(proposalResponse);
            }
        });
        Log.hlf.debug(`GoodCount=${goodCount}, badCount=${badCount}`);

        return badCount === 0;
    }

    protected logSuccessfulProposalResponse(results: ProposalResponseObject): void {
        let proposalResponses = results[0];
        Log.hlf.debug(HlfInfo.SUCCESFULLY_SENT_PROPOSAL, proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload.toString());
    }

    /**
     * Listen and wait for transaction comitting on peer
     *
     * @param transactionID
     * @returns {Promise<any>}
     */
    protected registerTxEvent(transactionID: string): Promise<any> {
        // set the transaction listener and set a timeout of 30sec
        // if the transaction did not get committed within the timeout period,
        // fail the transaction

        let eventHubTimeout = 30000;


        let eh = this.hlfConfig.eventHub;
        Log.hlf.info(HlfInfo.CONNECTING_EVENTHUB);
        eh.connect();
        Log.hlf.info(HlfInfo.CONNECTED_TO_EVENTHUB);
        return new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
                eh.disconnect();
                Log.hlf.error(HlfErrors.TRANSACTION_TIMED_OUT, transactionID);
                reject();
            }, eventHubTimeout);
            Log.hlf.info(HlfInfo.REGISTERING_TRANSACTION_EVENT_START);
            eh.registerTxEvent(transactionID, (tx, code) => {
                Log.hlf.info(HlfInfo.REGISTERING_TRANSACTION_EVENT_DONE);
                clearTimeout(handle);
                eh.unregisterTxEvent(transactionID);
                eh.disconnect();

                const status = {event_status: code, tx_id: transactionID};

                if (code !== 'VALID') {
                    Log.hlf.error(HlfErrors.INVALID_TRANSACTION, code);
                    reject(status);
                } else {
                    Log.hlf.debug(HlfInfo.COMMITTED_ON_PEER, eh.getPeerAddr());
                    resolve(status);
                }
            });
        });
    }
}

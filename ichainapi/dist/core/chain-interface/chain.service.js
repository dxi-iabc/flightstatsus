"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const logging_enum_1 = require("./logging.enum");
const hlfconfig_1 = require("./hlfconfig");
const log_service_1 = require("../../common/utils/logging/log.service");
const Client = require("fabric-client");
let ChainService = class ChainService {
    constructor(hlfConfig) {
        this.hlfConfig = hlfConfig;
    }
    newDefaultKeyValueStore(walletPath) {
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.CREATING_CLIENT);
        return Client.newDefaultKeyValueStore({ path: walletPath });
    }
    getUserContext(userId) {
        return this.hlfConfig.client.getUserContext(userId, true);
    }
    isUserEnrolled(user) {
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.CHECK_USER_ENROLLED);
        if (user === undefined || user == null || user.isEnrolled() === false) {
            log_service_1.Log.hlf.error(logging_enum_1.HlfErrors.NO_ENROLLED_USER);
            return false;
        }
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.USER_ENROLLED, user);
        return true;
    }
    handleError(err) {
        log_service_1.Log.hlf.error(err);
        throw err;
    }
    newQuery(requestFunction, requestArguments, chaincodeId, transientMap) {
        const request = {
            chaincodeId: chaincodeId,
            fcn: requestFunction,
            args: requestArguments,
            transientMap: transientMap
        };
        return this.hlfConfig.channel.queryByChaincode(request);
    }
    newTransactionQuery(transactionId) {
        return this.hlfConfig.channel.queryTransaction(transactionId);
    }
    getQueryResponse(queryResponses) {
        if (!queryResponses.length) {
            log_service_1.Log.hlf.debug(logging_enum_1.HlfInfo.NO_PAYLOADS_RETURNED);
        }
        else {
            if (queryResponses[0] instanceof Error) {
                return this.handleError(queryResponses[0].toString());
            }
        }
        log_service_1.Log.hlf.debug(logging_enum_1.HlfInfo.RESPONSE_IS, queryResponses[0].toString());
        if (!queryResponses[0].toString().length) {
            return null;
        }
        return JSON.parse(queryResponses[0].toString());
    }
    sendTransactionProposal(requestFunction, requestArguments, chaincodeId, transientMap) {
        const txId = this.hlfConfig.client.newTransactionID();
        log_service_1.Log.hlf.debug(logging_enum_1.HlfInfo.ASSIGNING_TRANSACTION_ID, txId._transaction_id);
        let request = {
            targets: this.hlfConfig.targets,
            chaincodeId: chaincodeId,
            fcn: requestFunction,
            args: requestArguments,
            transientMap: transientMap,
            txId: txId
        };
        return this.hlfConfig.channel.sendTransactionProposal(request)
            .then(proposalResponse => {
            return { txHash: txId._transaction_id, buffer: proposalResponse };
        });
    }
    isProposalGood(results) {
        let proposalResponses = results[0];
        let goodCount = 0, badCount = 0;
        proposalResponses.forEach(proposalResponse => {
            if (proposalResponse && proposalResponse.response &&
                proposalResponse.response.status === 200) {
                goodCount++;
                log_service_1.Log.hlf.debug(logging_enum_1.HlfInfo.GOOD_TRANSACTION_PROPOSAL);
            }
            else {
                badCount++;
                log_service_1.Log.hlf.error(logging_enum_1.HlfErrors.BAD_TRANSACTION_PROPOSAL, badCount);
            }
        });
        log_service_1.Log.hlf.debug(`GoodCount=${goodCount}, badCount=${badCount}`);
        return badCount === 0;
    }
    logSuccessfulProposalResponse(results) {
        let proposalResponses = results[0];
        log_service_1.Log.hlf.debug(logging_enum_1.HlfInfo.SUCCESFULLY_SENT_PROPOSAL, proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload.toString());
    }
    registerTxEvent(transactionID) {
        let eventHubTimeout = 30000;
        let eh = this.hlfConfig.eventHub;
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.CONNECTING_EVENTHUB);
        eh.connect();
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.CONNECTED_TO_EVENTHUB);
        return new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
                eh.disconnect();
                log_service_1.Log.hlf.error(logging_enum_1.HlfErrors.TRANSACTION_TIMED_OUT, transactionID);
                reject();
            }, eventHubTimeout);
            log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.REGISTERING_TRANSACTION_EVENT_START);
            eh.registerTxEvent(transactionID, (tx, code) => {
                log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.REGISTERING_TRANSACTION_EVENT_DONE);
                clearTimeout(handle);
                eh.unregisterTxEvent(transactionID);
                eh.disconnect();
                const status = { event_status: code, tx_id: transactionID };
                if (code !== 'VALID') {
                    log_service_1.Log.hlf.error(logging_enum_1.HlfErrors.INVALID_TRANSACTION, code);
                    reject(status);
                }
                else {
                    log_service_1.Log.hlf.debug(logging_enum_1.HlfInfo.COMMITTED_ON_PEER, eh.getPeerAddr());
                    resolve(status);
                }
            });
        });
    }
};
ChainService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [hlfconfig_1.HlfConfig])
], ChainService);
exports.ChainService = ChainService;
//# sourceMappingURL=chain.service.js.map
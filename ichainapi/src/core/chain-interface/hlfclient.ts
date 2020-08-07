import {HlfInfo} from './logging.enum';
import {Injectable} from '@nestjs/common';
import {ChainService} from './chain.service';
import {HlfConfig} from './hlfconfig';
import {IKeyValueStore, ProposalResponseObject, TransactionRequest} from 'fabric-client';
import FabricClient = require('fabric-client');
import {Appconfig} from '../../common/config/appconfig';
// import { ChainMethod } from '../../chainmethods.enum';
import {Log} from '../../common/utils/logging/log.service';
import {FlightChainMethod} from "../../flight-chain2/flight-chain2.service";
import * as Client from "fabric-client";
import * as fs from "fs";
import {EnvConfig} from "../../common/config/env";

@Injectable()
export class HlfClient extends ChainService {

    /**
     * The config will be initialised in the constructor - based on the target environemnt - local 'ibs_basic_network', or the k8s environmnet in AWS
     */
    static config: any = {};

    /**
     * This is the configuration to use on the k8s environment in AWS.
     */
    static configKubernetesEnvironment ={
        "peers": [
            
             {
                "name":"peer0.gatewick.ibs.aero",
                "endpoint": "grpc://localhost:9051",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer0.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
            },
            
            {
                "name":"peer1.gatewick.ibs.aero",
                "endpoint": "grpc://localhost:10051",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer1.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
            }
        ],
        "orderers": [
            {
                "name":"orderer.ibs.aero",
                "endpoint": "grpc://localhost:8050",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
            }
             ]
			 
		};	 
            
    /**
     * This is the local testing environment.
     */
    static configLocalTestNetwork = {
        "peers": [
             {
                "name":"peer0.gatewick.ibs.aero",
                "endpoint": "grpc://localhost:9051",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer0.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
            },
            {
                "name":"peer1.gatewick.ibs.aero",
                "endpoint": "grpc://localhost:10051",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer1.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
            }
        ],
         "orderers": [
            {
                "name":"orderer.ibs.aero",
                "endpoint": "grpc://localhost:7050",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
            },
            
              { 
                "name":"orderer2.ibs.aero",
                "endpoint": "grpc://localhost:8050",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer2.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
            },
            
            {
                "name":"orderer3.ibs.aero",
                "endpoint": "grpc://localhost:9050",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer3.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
            },
            
             {
                "name":"orderer4.ibs.aero",
                "endpoint": "grpc://localhost:10050",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer4.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
            },
             {
                "name":"orderer5.ibs.aero",
                "endpoint": "grpc://localhost:11050",
                "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer5.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
            }
            
        ]

			 
		};	 

    constructor(public hlfConfig: HlfConfig) {
        super(hlfConfig);

        if (EnvConfig.USE_IBS_TEST_FABRIC_NETWORK) {
            console.log('***************************************');
            console.log('Using the local testing fabric network.');
            console.log('Make sure you have checked out FlightChainSmartContract and have run FlightChainSmartContract/deployChainCode.sh');
            console.log('Using the local testing fabric network.');
            console.log('***************************************');
            HlfClient.config = HlfClient.configLocalTestNetwork;
        } else {
            console.log('Using the k8s fabric environment.')
            HlfClient.config = HlfClient.configKubernetesEnvironment;
        }

        console.log('Peer&Orderer config: ', HlfClient.config);
    }

    /**
     * init
     * @returns {Promise<any>}
     * @memberof ChainService
     */
    init(): Promise<any> {

        this.hlfConfig.options = Appconfig.hlf;
        this.hlfConfig.client = new FabricClient();

        Log.hlf.info('HlfClient.init()', this.hlfConfig);

        return FabricClient
            .newDefaultKeyValueStore({
                path: this.hlfConfig.options.walletPath
            })
            .then((wallet: IKeyValueStore) => {
                console.log(wallet);
                // assign the store to the fabric client
                this.hlfConfig.client.setStateStore(wallet);
                let cryptoSuite = FabricClient.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                let cryptoStore = FabricClient.newCryptoKeyStore({path: this.hlfConfig.options.walletPath});
                cryptoSuite.setCryptoKeyStore(cryptoStore);
                this.hlfConfig.client.setCryptoSuite(cryptoSuite);
                this.hlfConfig.channel = this.hlfConfig.client.newChannel(this.hlfConfig.options.channelId);


                HlfClient.config.peers.forEach(peer => {

                    var connectionOptions: Client.ConnectionOpts = {};
                    const data = fs.readFileSync(peer.pemFile);
                    connectionOptions.pem = Buffer.from(data).toString();
                    Log.hlf.debug(`Connecting to peer ${peer.endpoint}`, connectionOptions);
                    console.log('connectionOptions', connectionOptions);
                    const peerObj = this.hlfConfig.client.newPeer(peer.endpoint, connectionOptions);
                    this.hlfConfig.channel.addPeer(peerObj, EnvConfig.MSPID);
                    this.hlfConfig.targets.push(peerObj);

                    if (!this.hlfConfig.eventHub) {
                        console.log('Initialising the event hub');
                        this.hlfConfig.eventHub = this.hlfConfig.channel.newChannelEventHub(peerObj);
                    }
                });



 HlfClient.config.orderers.forEach(orderer => {
     var connectionOptions: Client.ConnectionOpts = {};
                const data = fs.readFileSync(orderer.pemFile);
                connectionOptions.pem = Buffer.from(data).toString();
                Log.hlf.debug(`Connecting to orderer ${orderer.endpoint}`, connectionOptions);
                this.hlfConfig.channel.addOrderer(this.hlfConfig.client.newOrderer(orderer.endpoint, connectionOptions));

     
     
 });

                /*var connectionOptions: Client.ConnectionOpts = {};
                const data = fs.readFileSync(HlfClient.config.orderers[0].pemFile);
                connectionOptions.pem = Buffer.from(data).toString();
                Log.hlf.debug(`Connecting to orderer ${HlfClient.config.orderers[0].endpoint}`, connectionOptions);
                this.hlfConfig.channel.addOrderer(this.hlfConfig.client.newOrderer(HlfClient.config.orderers[0].endpoint, connectionOptions));
                 */
                Log.hlf.info(HlfInfo.INIT_SUCCESS);
            });
    }

    /**
     * Query hlf
     *
     * @param {FlightChainMethod} chainMethod
     * @param {string[]} params
     * @param transientMap
     * @returns {Promise<any>}
     * @memberof HlfClient
     */
    query(chainMethod: FlightChainMethod, params: string[], transientMap?: Object): Promise<any> {
        Log.hlf.info(HlfInfo.MAKE_QUERY, chainMethod, params);
        return this.newQuery(chainMethod, params, this.hlfConfig.options.chaincodeId, transientMap)
            .then((queryResponses: Buffer[]) => {
                return Promise.resolve(this.getQueryResponse(queryResponses));
            });
    }

    /**
     * Query the transaction Id
     *
     * @param transactionId
     * @returns {Promise<any>}
     * @memberof HlfClient
     */
    queryTransaction(transactionId: string): Promise<any> {
        Log.hlf.info(HlfInfo.QUERY_TRANSACTIONID, transactionId);
        return this.newTransactionQuery(transactionId);
    }

    /**
     * invoke
     *
     * @param {FlightChainMethod} chainMethod
     * @param { string[]} params
     * @param transientMap
     * @returns
     * @memberof ChainService
     */
    invoke(chainMethod: FlightChainMethod, params: string[], transientMap?: Object): Promise<any> {
        Log.hlf.info(chainMethod, params);
        return this.sendTransactionProposal(chainMethod, params, this.hlfConfig.options.chaincodeId, transientMap)
            .then((result: { txHash: string; buffer: ProposalResponseObject }) => {
                Log.hlf.info(HlfInfo.CHECK_TRANSACTION_PROPOSAL);
                if (this.isProposalGood(result.buffer)) {
                    // console.log('isProposalGood', result.buffer);
                    this.logSuccessfulProposalResponse(result.buffer);
                    let request: TransactionRequest = {
                        proposalResponses: result.buffer[0],
                        proposal: result.buffer[1]
                    };
                    Log.hlf.info(HlfInfo.REGISTERING_TRANSACTION_EVENT);

                    let sendPromise = this.hlfConfig.channel.sendTransaction(request);
                    let txPromise = this.registerTxEvent(result.txHash);

                    return Promise.all([sendPromise, txPromise]);
                } else {


                    /**
                     * Handle when one or more of the proposal responses are not valid.
                     * Return as error msg, the first invalid proposal response.
                     */

                    let proposalResponse: Array<Client.ProposalResponse> = result.buffer[0];

                    let rejectionMessage:any = null;
                    proposalResponse.forEach((r: any) => {
                        // console.log(r.toString())
                        // console.log(r.status)
                        // console.log(JSON.stringify(r, null, 4))

                        // The object returned (r) doeesn't match properly the Client.ProposalResponse data structure
                        // so we pass it as a <any> data type.
                        // And to extract the actual error message the object needs to be converted to a string.
                        //
                        if (rejectionMessage === null && r.status === 500) {
                            let message = r.toString();
                            console.log(message)
                            if (message.indexOf(' transaction returned with failure: ') !== -1) {
                                message = message.split(' transaction returned with failure: ')[1];

                                try {
                                    rejectionMessage = JSON.parse(message);
                                } catch (e) {
                                    Log.hlf.error(e);
                                }
                            }
                        }
                    });

                    if (rejectionMessage)
                        return Promise.reject(rejectionMessage);
                    else {
                        console.log("Unable to extract a valid error message from teh Client.ProposalResponse - generating a generic error");
                        rejectionMessage = {};
                        rejectionMessage.name = 'error';
                        rejectionMessage.status = 500;
                        rejectionMessage.message = "Unknown Error";
                        return Promise.reject({"name" : "Unknown Error"});
                    }
                }
            })
            .then((results) => {
                if (!results || (results && results[0] && results[0].status !== 'SUCCESS')) {
                    Log.hlf.error('Failed to order the transaction. Error code: ' + results[0].status);
                }

                if (!results || (results && results[1] && results[1].event_status !== 'VALID')) {
                    Log.hlf.error('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
                }
            });
    }
}

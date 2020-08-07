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
var HlfClient_1;
const logging_enum_1 = require("./logging.enum");
const common_1 = require("@nestjs/common");
const chain_service_1 = require("./chain.service");
const hlfconfig_1 = require("./hlfconfig");
const FabricClient = require("fabric-client");
const appconfig_1 = require("../../common/config/appconfig");
const log_service_1 = require("../../common/utils/logging/log.service");
const fs = require("fs");
const env_1 = require("../../common/config/env");
let HlfClient = HlfClient_1 = class HlfClient extends chain_service_1.ChainService {
    constructor(hlfConfig) {
        super(hlfConfig);
        this.hlfConfig = hlfConfig;
        if (env_1.EnvConfig.USE_IBS_TEST_FABRIC_NETWORK) {
            console.log('***************************************');
            console.log('Using the local testing fabric network.');
            console.log('Make sure you have checked out FlightChainSmartContract and have run FlightChainSmartContract/deployChainCode.sh');
            console.log('Using the local testing fabric network.');
            console.log('***************************************');
            HlfClient_1.config = HlfClient_1.configLocalTestNetwork;
        }
        else {
            console.log('Using the k8s fabric environment.');
            HlfClient_1.config = HlfClient_1.configKubernetesEnvironment;
        }
        console.log('Peer&Orderer config: ', HlfClient_1.config);
    }
    init() {
        this.hlfConfig.options = appconfig_1.Appconfig.hlf;
        this.hlfConfig.client = new FabricClient();
        log_service_1.Log.hlf.info('HlfClient.init()', this.hlfConfig);
        return FabricClient
            .newDefaultKeyValueStore({
            path: this.hlfConfig.options.walletPath
        })
            .then((wallet) => {
            console.log(wallet);
            this.hlfConfig.client.setStateStore(wallet);
            let cryptoSuite = FabricClient.newCryptoSuite();
            let cryptoStore = FabricClient.newCryptoKeyStore({ path: this.hlfConfig.options.walletPath });
            cryptoSuite.setCryptoKeyStore(cryptoStore);
            this.hlfConfig.client.setCryptoSuite(cryptoSuite);
            this.hlfConfig.channel = this.hlfConfig.client.newChannel(this.hlfConfig.options.channelId);
            HlfClient_1.config.peers.forEach(peer => {
                var connectionOptions = {};
                const data = fs.readFileSync(peer.pemFile);
                connectionOptions.pem = Buffer.from(data).toString();
                log_service_1.Log.hlf.debug(`Connecting to peer ${peer.endpoint}`, connectionOptions);
                console.log('connectionOptions', connectionOptions);
                const peerObj = this.hlfConfig.client.newPeer(peer.endpoint, connectionOptions);
                this.hlfConfig.channel.addPeer(peerObj, env_1.EnvConfig.MSPID);
                this.hlfConfig.targets.push(peerObj);
                if (!this.hlfConfig.eventHub) {
                    console.log('Initialising the event hub');
                    this.hlfConfig.eventHub = this.hlfConfig.channel.newChannelEventHub(peerObj);
                }
            });
            HlfClient_1.config.orderers.forEach(orderer => {
                var connectionOptions = {};
                const data = fs.readFileSync(orderer.pemFile);
                connectionOptions.pem = Buffer.from(data).toString();
                log_service_1.Log.hlf.debug(`Connecting to orderer ${orderer.endpoint}`, connectionOptions);
                this.hlfConfig.channel.addOrderer(this.hlfConfig.client.newOrderer(orderer.endpoint, connectionOptions));
            });
            log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.INIT_SUCCESS);
        });
    }
    query(chainMethod, params, transientMap) {
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.MAKE_QUERY, chainMethod, params);
        return this.newQuery(chainMethod, params, this.hlfConfig.options.chaincodeId, transientMap)
            .then((queryResponses) => {
            return Promise.resolve(this.getQueryResponse(queryResponses));
        });
    }
    queryTransaction(transactionId) {
        log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.QUERY_TRANSACTIONID, transactionId);
        return this.newTransactionQuery(transactionId);
    }
    invoke(chainMethod, params, transientMap) {
        log_service_1.Log.hlf.info(chainMethod, params);
        return this.sendTransactionProposal(chainMethod, params, this.hlfConfig.options.chaincodeId, transientMap)
            .then((result) => {
            log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.CHECK_TRANSACTION_PROPOSAL);
            if (this.isProposalGood(result.buffer)) {
                this.logSuccessfulProposalResponse(result.buffer);
                let request = {
                    proposalResponses: result.buffer[0],
                    proposal: result.buffer[1]
                };
                log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.REGISTERING_TRANSACTION_EVENT);
                let sendPromise = this.hlfConfig.channel.sendTransaction(request);
                let txPromise = this.registerTxEvent(result.txHash);
                return Promise.all([sendPromise, txPromise]);
            }
            else {
                let proposalResponse = result.buffer[0];
                let rejectionMessage = null;
                proposalResponse.forEach((r) => {
                    if (rejectionMessage === null && r.status === 500) {
                        let message = r.toString();
                        console.log(message);
                        if (message.indexOf(' transaction returned with failure: ') !== -1) {
                            message = message.split(' transaction returned with failure: ')[1];
                            try {
                                rejectionMessage = JSON.parse(message);
                            }
                            catch (e) {
                                log_service_1.Log.hlf.error(e);
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
                    return Promise.reject({ "name": "Unknown Error" });
                }
            }
        })
            .then((results) => {
            if (!results || (results && results[0] && results[0].status !== 'SUCCESS')) {
                log_service_1.Log.hlf.error('Failed to order the transaction. Error code: ' + results[0].status);
            }
            if (!results || (results && results[1] && results[1].event_status !== 'VALID')) {
                log_service_1.Log.hlf.error('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
            }
        });
    }
};
HlfClient.config = {};
HlfClient.configKubernetesEnvironment = {
    "peers": [
        {
            "name": "peer0.gatewick.ibs.aero",
            "endpoint": "grpc://peer0.gatewick.ibs.aero:9051",
            "pemFile": env_1.EnvConfig.CRYPTO_CONFIG_PATH + "/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer0.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
        },
        {
            "name": "peer1.gatewick.ibs.aero",
            "endpoint": "grpc://peer1.gatewick.ibs.aero:10051",
            "pemFile": env_1.EnvConfig.CRYPTO_CONFIG_PATH + "/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer1.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
        }
    ],
    "orderers": [
        {
            "name": "orderer.ibs.aero",
            "endpoint": "grpc://orderer.ibs.aero:8050",
            "pemFile": env_1.EnvConfig.CRYPTO_CONFIG_PATH + "/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
        }
    ]
};
HlfClient.configLocalTestNetwork = {
    "peers": [
        {
            "name": "peer0.gatewick.ibs.aero",
            "endpoint": "grpc://localhost:9051",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer0.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
        },
        {
            "name": "peer1.gatewick.ibs.aero",
            "endpoint": "grpc://localhost:10051",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/peers/peer1.gatewick.ibs.aero/msp/tlscacerts/tlsca.gatewick.ibs.aero-cert.pem"
        }
    ],
    "orderers": [
        {
            "name": "orderer.ibs.aero",
            "endpoint": "grpc://localhost:7050",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
        },
        {
            "name": "orderer2.ibs.aero",
            "endpoint": "grpc://localhost:8050",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer2.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
        },
        {
            "name": "orderer3.ibs.aero",
            "endpoint": "grpc://localhost:9050",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer3.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
        },
        {
            "name": "orderer4.ibs.aero",
            "endpoint": "grpc://localhost:10050",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer4.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
        },
        {
            "name": "orderer5.ibs.aero",
            "endpoint": "grpc://localhost:11050",
            "pemFile": "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network/crypto-config/ordererOrganizations/ibs.aero/orderers/orderer5.ibs.aero/msp/tlscacerts/tlsca.ibs.aero-cert.pem"
        }
    ]
};
HlfClient = HlfClient_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [hlfconfig_1.HlfConfig])
], HlfClient);
exports.HlfClient = HlfClient;
//# sourceMappingURL=hlfclient.js.map
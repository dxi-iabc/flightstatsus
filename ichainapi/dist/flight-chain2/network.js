'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const configPath = path.join(process.cwd(), '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var userName = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;
const filePath = path.join(process.cwd(), '/connection2.yaml');
let fileContents = fs.readFileSync(filePath, 'utf8');
let connectionFile = yaml.safeLoad(fileContents);
exports.createFlight = function (flightData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var response = {};
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = yield wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }
            console.log('we here in createCar');
            const gateway = new Gateway();
            yield gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });
            const network = yield gateway.getNetwork('channelflight');
            const contract = network.getContract('flightstatuschain');
            let result = yield contract.submitTransaction("createFlight", flightData);
            console.log('Transaction has been submitted');
            yield gateway.disconnect();
            response.msg = 'createCar Transaction has been submitted';
            return Promise.resolve(result);
        }
        catch (error) {
            console.error("---", `Failed to submit transaction: ${error}`, "Message ---", error.message, "Fulll--", error.responses[0]);
            response.msg = error.responses[0].message;
            return Promise.resolve({ "message": error.responses[0].message, "status": "Error" });
        }
    });
};
exports.updateFlight = function (flightKey, flightData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var response = {};
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = yield wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }
            console.log('we here in createCar');
            const gateway = new Gateway();
            yield gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });
            const network = yield gateway.getNetwork('channelflight');
            const contract = network.getContract('flightstatuschain');
            let result = yield contract.submitTransaction("updateFlight", flightKey, flightData);
            console.log('Transaction has been submitted');
            yield gateway.disconnect();
            response.msg = 'createCar Transaction has been submitted';
            return Promise.resolve(result);
        }
        catch (error) {
            console.error("---", `Failed to submit transaction: ${error}`, "Message ---", error.message, "Fulll--", error.responses[0]);
            response.msg = error.responses[0].message;
            return Promise.resolve({ "message": error.responses[0].message, "status": "Error" });
        }
    });
};
exports.queryFlight = function (methodName, param) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('starting to queryAllCars');
            var response = {};
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = yield wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }
            const gateway = new Gateway();
            yield gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });
            const network = yield gateway.getNetwork('channelflight');
            const contract = network.getContract('flightstatuschain');
            const result = yield contract.evaluateTransaction(methodName, param);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            return JSON.parse(result);
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            response.error = error.message;
            return response;
        }
    });
};
exports.getTaxDetails = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('starting to queryAllCars');
            var response = {};
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = yield wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }
            const gateway = new Gateway();
            yield gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });
            const network = yield gateway.getNetwork('channelflight');
            var client = gateway.getClient();
            var channel = client.getChannel("channelflight");
            if (!channel) {
                throw new Error("Chhenl not found!");
            }
            let response_payload = yield channel.queryTransaction(id, "peer0.birtishairways.ibs.aero");
            console.log("Tarsction details", response_payload);
            let buf = Buffer.from(JSON.stringify(response_payload));
            var temp = JSON.parse(buf.toString());
            return temp;
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            response.error = error.message;
            return response;
        }
    });
};
exports.getVersion = function (methodName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('starting to queryAllCars');
            var response = {};
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = yield wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }
            const gateway = new Gateway();
            yield gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });
            const network = yield gateway.getNetwork('channelflight');
            const contract = network.getContract('flightstatuschain');
            const result = yield contract.evaluateTransaction(methodName);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            return JSON.parse(result);
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            response.error = error.message;
            return response;
        }
    });
};
exports.queryWorldState = function (methodName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('starting to queryWorldState');
            var response = {};
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = yield wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }
            const gateway = new Gateway();
            yield gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });
            const network = yield gateway.getNetwork('channelflight');
            const contract = network.getContract('flightstatuschain');
            const result = yield contract.evaluateTransaction("getAllDataCode");
            console.log("Transaction has been evaluated, result is:", result);
            return JSON.parse(result);
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            response.error = error.message;
            return response;
        }
    });
};
//# sourceMappingURL=network.js.map
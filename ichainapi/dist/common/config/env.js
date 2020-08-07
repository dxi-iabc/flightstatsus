"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path = require("path");
const log_service_1 = require("../utils/logging/log.service");
class EnvConfig {
    static initialise() {
        log_service_1.Log.config.debug('Initialising the environment variables.');
        for (let propName of Object.keys(EnvConfig)) {
            log_service_1.Log.config.debug(`${propName}:  ${EnvConfig[propName]}`);
        }
    }
}
EnvConfig.LISTENING_PORT = process.env['LISTENING_PORT'] || 3001;
EnvConfig.NODE_ENV = 'LOCAL';
EnvConfig.DB_HOST = process.env["DBHOST"] || "localhost";
EnvConfig.DB_PASSWORD = process.env["DBPASSWORD"] || "root123";
EnvConfig.DB_USERNAME = process.env["DBUSERNAME"] || "root";
EnvConfig.DB_PORT = process.env["ROOT"] || 3306;
EnvConfig.DB_NAME = process.env["DBNAME"] || "sitafc";
EnvConfig.IDENTITY = process.env['IDENTITY'] || "FlightChainLGW";
EnvConfig.IDENTITY_USER = process.env['IDENTITY_USER'] || "FlightChainLGW";
EnvConfig.HFC_STORE_PATH = process.env['HFC_STORE_PATH'] || path.join('./', 'wallet/' + EnvConfig.IDENTITY_USER);
EnvConfig.CHANNEL = 'channelflight';
EnvConfig.MSPID = process.env['MSPID'] || 'GatewickMSP';
EnvConfig.IS_DEMO_MODE = true;
EnvConfig.USE_IBS_TEST_FABRIC_NETWORK = false;
EnvConfig.USER_TOKENS = process.env['USER_TOKENS'] || "USER_TOKENS";
EnvConfig.CHAIN_CODE = process.env['CHAIN_CODE_NAME'] || "flightstatuschain";
EnvConfig.CA_URL = process.env['CA_URL'] || "https://localhost:8054";
EnvConfig.CA_NAME = process.env['CA_NAME'] || "ca.gatewick.ibs.aero";
EnvConfig.CRYPTO_CONFIG_PATH = process.env['CTYPTO_PATH'] || "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network";
exports.EnvConfig = EnvConfig;
//# sourceMappingURL=env.js.map
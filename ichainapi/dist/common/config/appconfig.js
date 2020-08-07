"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const newLocal = env_1.EnvConfig.CRYPTO_CONFIG_PATH;
exports.Appconfig = {
    hlf: {
        walletPath: env_1.EnvConfig.HFC_STORE_PATH,
        admin: {
            MspID: env_1.EnvConfig.MSPID
        },
        channelId: env_1.EnvConfig.CHANNEL,
        chaincodeId: env_1.EnvConfig.CHAIN_CODE,
        tlsOptions: {
            trustedRoots: [env_1.EnvConfig.CRYPTO_CONFIG_PATH + '/crypto-config/peerOrganizations/gatewick.ibs.aero/ca/ca.gatewick.ibs.aero-cert.pem'],
            verify: false
        },
        caName: env_1.EnvConfig.CA_NAME,
        url: env_1.EnvConfig.CA_URL
    }
};
//# sourceMappingURL=appconfig.js.map
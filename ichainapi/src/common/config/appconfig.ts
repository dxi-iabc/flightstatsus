import { EnvConfig } from './env';
import * as path from 'path';
import { ConfigOptions } from './config.model';

const newLocal = EnvConfig.CRYPTO_CONFIG_PATH;
export const Appconfig: ConfigOptions = {
    hlf: {
        walletPath: EnvConfig.HFC_STORE_PATH, //path.resolve(__dirname, `creds`),
        admin: {
            MspID: EnvConfig.MSPID
        },
        channelId: EnvConfig.CHANNEL,
        chaincodeId: EnvConfig.CHAIN_CODE,

        tlsOptions: {
            trustedRoots: [EnvConfig.CRYPTO_CONFIG_PATH+'/crypto-config/peerOrganizations/gatewick.ibs.aero/ca/ca.gatewick.ibs.aero-cert.pem'],
            verify: false
        },
        caName: EnvConfig.CA_NAME,
        url:EnvConfig.CA_URL
        
    }
} as ConfigOptions;


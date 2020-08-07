import 'dotenv/config';
import * as path from "path";
import {HlfConfig} from "../../core/chain-interface/hlfconfig";
import {Log} from "../utils/logging/log.service";

export interface ProcessEnv {
    [key: string]: string | undefined;
}

/**
 * node EnvConfig variables,
 * copy .env.example file, rename to .env
 *
 * @export
 * @class EnvConfig
 */
export class EnvConfig {


    static initialise () {

//        console.log(process.env);

        // list env keys in console
        Log.config.debug('Initialising the environment variables.');

        for (let propName of Object.keys(EnvConfig)) {
            Log.config.debug(`${propName}:  ${EnvConfig[propName]}`);
        }
    }
    // NODE
    public static LISTENING_PORT = process.env['LISTENING_PORT'] || 3001;
    public static NODE_ENV = 'LOCAL';
    
     public static DB_HOST = process.env["DBHOST"] || "localhost";
     
     public static DB_PASSWORD = process.env["DBPASSWORD"] || "root123";
     
     public static DB_USERNAME = process.env["DBUSERNAME"] || "root";
     
     public static DB_PORT = process.env["ROOT"] || 3306;
     
     public static DB_NAME = process.env["DBNAME"] || "sitafc";
     
     
    

    // FABRIC
    public static IDENTITY = process.env['IDENTITY'];
    public static HFC_STORE_PATH = process.env['HFC_STORE_PATH'] || path.join('./', 'bootstrap/hfc-key-store');
    public static CHANNEL = 'channelflight';

    // Organisational MSP Id
    public static MSPID: string = process.env['MSPID'] || 'GatewickMSP';

    // True if this app is in demo mode, and not connected to a fabric network.
    public static IS_DEMO_MODE = true;


    public static USE_IBS_TEST_FABRIC_NETWORK = false;

    public static USER_TOKENS = process.env['USER_TOKENS']|| "USER_TOKENS";
    
    public static CHAIN_CODE = process.env['CHAIN_CODE_NAME']|| "flightchain";
    
    public static CA_URL = process.env['CA_URL'] || "https://localhost:8054"
    
    public static CA_NAME = process.env['CA_NAME'] || "ca.gatewick.ibs.aero"
    
    public static CRYPTO_CONFIG_PATH = process.env['CRYPTO_CONFIG_PATH'] || "/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network"

}
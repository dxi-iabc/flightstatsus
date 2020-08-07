import { Inject, Module } from '@nestjs/common';
import { Log } from '../common/utils/logging/log.service';
import { EnvConfig } from '../common/config/env';
import {ChainModule} from "./chain-interface/chain.module";
import {HlfClient} from "./chain-interface/hlfclient";
import {HlfErrors, HlfInfo} from "./chain-interface/logging.enum";
import {User} from "fabric-client";
import {HlfConfig} from "./chain-interface/hlfconfig";

@Module({
    imports: [
        ChainModule,
    ]
})
export class CoreModule {

    /**
     * Creates an instance of ApplicationModule.
     * @param {HlfClient} hlfClient
     * @param caClient
     * @param {QueueListenerService} queueListenerService
     * @param webSocketService
     * @memberof ApplicationModule
     */
    constructor(private hlfClient: HlfClient,
                private hlfConfig: HlfConfig) {


        // init hlf client and hlf ca client
        // assign admin user
        console.log('hlfClient.init(START)');
        this.hlfClient.init()
            .then(result => {
                console.log('hlfClient.init() - done, returning Promise.resolve()');
                return Promise.resolve();
            })
            .then(() => {
                console.log(`hlfClient.init() - loading user from store: '${EnvConfig.IDENTITY}'`);
                return this.getUserFromStore(EnvConfig.IDENTITY);
            })
            .catch(err => {
                console.log(`hlfClient.init() - error`, err);
                Log.awssqs.error(HlfErrors.ERROR_STARTING_HLF, err.message);
            });
    }


    getUserFromStore(userId: string, checkPersistence = true): Promise<User> {
        return (this.hlfConfig.client.getUserContext(userId, checkPersistence) as Promise<User>)
            .then(userFromStore => {
                if (userFromStore && userFromStore.isEnrolled()) {
                    Log.hlf.info(HlfInfo.LOAD_USER_SUCCESS, userId);
                    return userFromStore;
                } else {
                    Log.hlf.error(HlfErrors.LOAD_USER_ERROR, userId);
                    process.exit(1);
                }
            });
    }

}
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
const log_service_1 = require("../common/utils/logging/log.service");
const env_1 = require("../common/config/env");
const chain_module_1 = require("./chain-interface/chain.module");
const hlfclient_1 = require("./chain-interface/hlfclient");
const logging_enum_1 = require("./chain-interface/logging.enum");
const hlfconfig_1 = require("./chain-interface/hlfconfig");
let CoreModule = class CoreModule {
    constructor(hlfClient, hlfConfig) {
        this.hlfClient = hlfClient;
        this.hlfConfig = hlfConfig;
        console.log('hlfClient.init(START)');
        this.hlfClient.init()
            .then(result => {
            console.log('hlfClient.init() - done, returning Promise.resolve()');
            return Promise.resolve();
        })
            .then(() => {
            console.log(`hlfClient.init() - loading user from store: '${env_1.EnvConfig.IDENTITY}'`);
            return this.getUserFromStore(env_1.EnvConfig.IDENTITY);
        })
            .catch(err => {
            console.log(`hlfClient.init() - error`, err);
            log_service_1.Log.awssqs.error(logging_enum_1.HlfErrors.ERROR_STARTING_HLF, err.message);
        });
    }
    getUserFromStore(userId, checkPersistence = true) {
        return this.hlfConfig.client.getUserContext(userId, checkPersistence)
            .then(userFromStore => {
            if (userFromStore && userFromStore.isEnrolled()) {
                log_service_1.Log.hlf.info(logging_enum_1.HlfInfo.LOAD_USER_SUCCESS, userId);
                return userFromStore;
            }
            else {
                log_service_1.Log.hlf.error(logging_enum_1.HlfErrors.LOAD_USER_ERROR, userId);
                process.exit(1);
            }
        });
    }
};
CoreModule = __decorate([
    common_1.Module({
        imports: [
            chain_module_1.ChainModule,
        ]
    }),
    __metadata("design:paramtypes", [hlfclient_1.HlfClient,
        hlfconfig_1.HlfConfig])
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map
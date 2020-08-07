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
const hlfclient_1 = require("./hlfclient");
const log_service_1 = require("../../common/utils/logging/log.service");
let RequestHelper = class RequestHelper {
    constructor(hlfClient) {
        this.hlfClient = hlfClient;
    }
    invokeRequest(chainMethod, params, transientMap) {
        return this.hlfClient
            .invoke(chainMethod, params, transientMap)
            .then((response) => {
            log_service_1.Log.hlf.debug('Invoke successfully executed: ', response);
            return { txHash: response };
        })
            .catch((error) => {
            log_service_1.Log.hlf.error(`${chainMethod}`, error);
            throw error;
        });
    }
    queryRequest(chainMethod, params, transientMap) {
        return this.hlfClient
            .query(chainMethod, params, transientMap)
            .then((response) => {
            log_service_1.Log.hlf.debug('Query successfully executed!');
            return response;
        })
            .catch((error) => {
            console.log('queryRequestError', error);
            log_service_1.Log.hlf.error(`${chainMethod}`, error);
            throw error;
        });
    }
    queryTransaction(transactionId) {
        return this.hlfClient
            .queryTransaction(transactionId)
            .then((response) => {
            log_service_1.Log.hlf.debug('queryTransaction successfully executed!');
            return response;
        })
            .catch((error) => {
            log_service_1.Log.hlf.error(`Cannot get transactionId details`, error);
            throw error;
        });
    }
};
RequestHelper = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [hlfclient_1.HlfClient])
], RequestHelper);
exports.RequestHelper = RequestHelper;
//# sourceMappingURL=requesthelper.js.map
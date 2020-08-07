"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_service_1 = require("./logging/log.service");
class Json {
}
Json.serializeJson = (obj) => {
    try {
        return JSON.stringify(obj);
    }
    catch (error) {
        log_service_1.Log.config.error(`JSON stringify error for object: ${obj}`);
        throw error;
    }
};
Json.deserializeJson = (string) => {
    try {
        return JSON.parse(string);
    }
    catch (error) {
        log_service_1.Log.config.error(`JSON parse error for string: ${string}`);
        throw error;
    }
};
Json.stringifyParams = (params) => {
    try {
        return params.map(param => {
            if (typeof param === 'object' || Array.isArray(param)) {
                return JSON.stringify(param);
            }
            else {
                return param.toString();
            }
        });
    }
    catch (error) {
        log_service_1.Log.config.error(`stringifyParams error for params: ${params}`);
        throw error;
    }
};
exports.Json = Json;
//# sourceMappingURL=json.js.map
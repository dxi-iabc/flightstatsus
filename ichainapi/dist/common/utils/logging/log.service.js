"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("./winston");
class Log {
}
Log.hlf = winston_1.Loggers.hlf;
Log.grpc = winston_1.Loggers.grpc;
Log.pusher = winston_1.Loggers.pusher;
Log.awssqs = winston_1.Loggers.awssqs;
Log.config = winston_1.Loggers.config;
exports.Log = Log;
//# sourceMappingURL=log.service.js.map
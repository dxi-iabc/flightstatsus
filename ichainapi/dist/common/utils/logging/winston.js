"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
class Loggers {
}
Loggers.getLogger = (label) => {
    return winston_1.createLogger({
        transports: [new winston_1.transports.Console({
                level: 'debug',
            })],
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.splat(), winston_1.format.simple(), winston_1.format.label({ label: label })),
        exitOnError: false,
    });
};
Loggers.hlf = Loggers.getLogger('FABRIC');
Loggers.grpc = Loggers.getLogger('GRPC');
Loggers.pusher = Loggers.getLogger('PUSHER');
Loggers.config = Loggers.getLogger('CONFIG');
Loggers.awssqs = Loggers.getLogger('SQS');
exports.Loggers = Loggers;
//# sourceMappingURL=winston.js.map
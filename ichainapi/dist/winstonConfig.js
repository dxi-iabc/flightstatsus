const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
const myFormat = printf(info => {
    return `[${info.level}]  ${info.message}`;
});
const logger = winston.createLogger({
    level: 'info',
    format: myFormat,
    transports: [
        new winston.transports.Console(options.console)
    ]
});
module.exports = logger;
//# sourceMappingURL=winstonConfig.js.map
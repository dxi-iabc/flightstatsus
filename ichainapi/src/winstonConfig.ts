const winston = require('winston');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

// define the custom settings for each transport (file, console)
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
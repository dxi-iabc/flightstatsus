import { createLogger, format, Logger, transports } from 'winston';

export class Loggers {
      
    static getLogger = (label: string) => {
         return createLogger({
            transports: [new transports.Console({
                level: 'debug',
              
            })],
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.simple(),
                format.label({label: label})
            ),
            exitOnError: false,
        });
    }  
  
    public static hlf: Logger = Loggers.getLogger('FABRIC');
    public static grpc: Logger = Loggers.getLogger('GRPC');
    public static pusher: Logger = Loggers.getLogger('PUSHER');
    public static config: Logger = Loggers.getLogger('CONFIG');
    public static awssqs: Logger = Loggers.getLogger('SQS');
}

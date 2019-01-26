import * as bunyan from 'bunyan';
import { IncomingMessage, OutgoingMessage } from 'http';

export interface ILoggerConfig {
    name: string;
    level: bunyan.LogLevel;
    filePath?: string;
}

export type LogFunction = (...message : (string[] | Error[] | IncomingMessage[] | OutgoingMessage[])) => void;

export interface ILogger {
    trace: LogFunction;
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    error: LogFunction;
    fatal: LogFunction;
}

export class Logger implements ILogger {

    public trace : LogFunction;
    public debug : LogFunction;
    public info : LogFunction;
    public warn : LogFunction;
    public error : LogFunction;
    public fatal : LogFunction;

    constructor(options: ILoggerConfig) {
        const {name, level, filePath} = options;

        const streams : bunyan.Stream[] = [
            {
                stream: process.stdout,
                level: options.level
            },
            {
                stream: process.stderr,
                level: 'error'
            }
        ];

        if (!!filePath) {
            streams.push({
                path: options.filePath,
                level: options.level
            });
        }

        const logger : ILogger = bunyan.createLogger({ name, streams });

        const {
            trace,
            debug,
            info,
            warn,
            error,
            fatal
        } = logger;

        this.trace = trace.bind(logger);
        this.debug = debug.bind(logger);
        this.info = info.bind(logger);
        this.warn = warn.bind(logger);
        this.error = error.bind(logger);
        this.fatal = fatal.bind(logger);
    }
}

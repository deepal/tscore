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

/**
 * Logging module
 */
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

        if (Boolean(filePath)) {
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

        this.trace = <LogFunction>trace.bind(logger);
        this.debug = <LogFunction>debug.bind(logger);
        this.info = <LogFunction>info.bind(logger);
        this.warn = <LogFunction>warn.bind(logger);
        this.error = <LogFunction>error.bind(logger);
        this.fatal = <LogFunction>fatal.bind(logger);
    }
}

import { LogLevel } from 'bunyan';
import { IncomingMessage, OutgoingMessage } from 'http';

export interface ILoggerConfig {
    name: string;
    level: LogLevel;
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

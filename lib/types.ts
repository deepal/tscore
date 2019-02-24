import bunyan from 'bunyan';
import express from 'express';
import { IncomingMessage, OutgoingMessage } from 'http';

export interface IHTTPSConfig {
    key: string;
    cert: string;
}

export interface IListnerConfig {
    host?: string;
    port?: number;
    secure?: boolean;
}

export type IMiddleware = (req: express.Request, res: express.Response, next?: Function) => void;

export interface IServerHeadersConfig {
    noCache?: boolean;
    frameGuard?: boolean;
    xssFilter?: boolean;
    maskPoweredBy?: boolean;
}

export interface IServerConfig extends IListnerConfig {
    basicAuthParser?: boolean;
    jsonBodyParser?: boolean;
    secureHeaders?: IServerHeadersConfig;
    httpsConfig? : IHTTPSConfig;
}

export interface IRouteConfig {
    method?: string;
    path: string;
    handler: IMiddleware;
}

export interface IBasicAuthInfo {
    username: string;
    password: string;
}

export interface IAppLocals {
    appId: string;
}

export interface IResponseLocals {
    auth: {
        header: string;
        username: string;
        password: string;
    };
}

export type IEventListener = (...args: any[]) => void;      //tslint:disable-line

export interface IModule {
    init() : void;
}

export interface ILoggerConfig {
    name: string;
    level?: bunyan.LogLevel;
    filePath?: string;
}

export type LogFunction = (...message : (string[] | Error[] | IncomingMessage[] | OutgoingMessage[])) => void;
export type CreateChildLoggerFunction = (options: Object, simple?: boolean | undefined) => ILogger;

export interface ILogger {
    trace: LogFunction;
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    error: LogFunction;
    fatal: LogFunction;
    child?: CreateChildLoggerFunction;
}

export interface IModuleDescription {
    name: string;
    path: string;
}

export interface ILauncherConfig {
    name: string;
    baseDir?: string;
    loggerConfig?: ILoggerConfig;
}

export interface IApplicationConfig extends ILauncherConfig {
    name: string;
    baseDir: string;
    configLoader?: IConfigLoader;
    moduleDescription: IModuleDescription[];
    loggerConfig: ILoggerConfig;
}

export interface IContainer {
    baseDir: string;
    logger(): ILogger;
    config(module: string): (object | undefined);
    module(moduleName: string): IModule;
}

export interface IInjections {
    container?: IContainer;
    logger?: ILogger;
    config?: IConfigObj;
}

export interface IConstructibleModule<T> {
    prototype: T;
    new (injections: IInjections): T;
}

export interface ITsCoreESModule<T> {
    default: IConstructibleModule<T>;
    __esModule: true;
}

export interface IConfigObj {
    [key: string]: (string|number|boolean|IConfigObj);
}

export interface IConfigLoader {
    loadConfig(container: IContainer) : Promise<IConfigObj>;
}

export interface ILocalConfigLoaderOptions {
    filePath: string;
}

/**
 * Declaration of Launcher class
 */
export declare class ILauncher {
    constructor (launcherConfig : ILauncherConfig);
    public onBaseDir (baseDir : string) : ILauncher;
    public withConfig (configLoader: IConfigLoader) : ILauncher;
    public withLoggerConfig (loggerConfig: ILoggerConfig) : ILauncher;
    public module (moduleDescription: IModuleDescription) : ILauncher;
    public start () : void;
}

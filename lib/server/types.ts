import {Request, Response} from 'express';

export interface IHTTPSConfig {
    key: string;
    cert: string;
}

export interface IListnerConfig {
    host?: string;
    port: number;
    secure?: boolean;
}

export type IMiddleware = (req: Request, res: Response, next?: Function) => void;

export interface IServerConfig extends IListnerConfig {
    httpsConfig? : IHTTPSConfig;
}

export interface IRouteConfig {
    method: string;
    path: string;
    handler: IMiddleware;
}

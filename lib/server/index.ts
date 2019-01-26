import * as bodyParser from 'body-parser';
import express from 'express';
import {readFileSync} from 'fs';
import * as helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import {v4 as uuidV4} from 'uuid';

const DEFAULT_HOST : string = '0.0.0.0';

export interface IHTTPSConfig {
    key: string;
    cert: string;
}

export interface IListnerConfig {
    host?: string;
    port: number;
    secure?: boolean;
}

export type IMiddleware = (req: express.Request, res: express.Response, next?: Function) => void;

export interface IServerConfig extends IListnerConfig {
    httpsConfig? : IHTTPSConfig;
}

export interface IRouteConfig {
    method: string;
    path: string;
    handler: IMiddleware;
}

export class Server {

    private serverConfig : IServerConfig;
    private app : express.Application;

    constructor() {
        this.app = express();
        this.app.locals = {
            appId: uuidV4()
        };

        this.app
            .use(bodyParser.json())
            .use(helmet.noCache())
            .use(helmet.frameguard())
            .use(helmet.xssFilter())
            .use(helmet.hidePoweredBy({ setTo: this.app.locals.appId }));
    }

    public getServerConfig() : IServerConfig {
        return this.serverConfig;
    }

    public setHTTPSCredentials(httpsConfig: IHTTPSConfig) : Server {
        this.serverConfig.httpsConfig = httpsConfig;
        return this;
    }

    public listen(listenerConfig : IListnerConfig) : (http.Server | https.Server) {
        this.serverConfig = { ...listenerConfig, host: DEFAULT_HOST };
        let server : (http.Server | https.Server);

        if (this.serverConfig.httpsConfig) {
            const {key, cert} = <IHTTPSConfig>this.serverConfig.httpsConfig;
            server = https.createServer({
                key: readFileSync(key),
                cert: readFileSync(cert)
            }, this.app);
        } else {
            server = http.createServer(this.app);
        }

        return server.listen(this.serverConfig.port, this.serverConfig.host);
    }

    /**
     * Convenient function to register more than one route
     * @param routeConfig Route configuration
     */
    public routes(routeConfig: IRouteConfig[]) : Server {
        routeConfig.forEach((route : IRouteConfig) => this.registerRoute(route));
        return this.route(routeConfig);
    }

    public route(routeConfig: (IRouteConfig | IRouteConfig[])) : Server {
        return this.registerRoute(<IRouteConfig>routeConfig);
    }

    public middleware(middlewareFn : IMiddleware) : Server {
        this.app.use(middlewareFn);
        return this;
    }

    private registerRoute(routeConfig: IRouteConfig) : Server {
        const {method, path, handler} = routeConfig;
        let applicationListener : express.IRouterMatcher<express.Application> = this.app.get;
        switch (method) {
            case 'post':
                applicationListener = this.app.post; break;
            case 'put':
                applicationListener = this.app.put; break;
            case 'delete':
                applicationListener = this.app.delete; break;
            case 'head':
                applicationListener = this.app.head; break;
            case 'patch':
                applicationListener = this.app.patch; break;
            case 'get':
            default:
                applicationListener = this.app.get;
        }
        applicationListener.bind(this.app)(path, handler);
        return this;
    }
}

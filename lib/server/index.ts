import * as bodyParser from 'body-parser';
import { EventEmitter } from 'events';
import express, { Request, Response } from 'express';
import {readFileSync} from 'fs';
import * as helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import {v4 as uuidV4} from 'uuid';
import {basicAuthParser} from '../security';

const DEFAULT_HOST : string = '0.0.0.0';
const DEFAULT_PORT : number = 8080;

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

export type IEventListener = (...args: any[]) => void;      //tslint:disable-line

const defaultServerConfig: IServerConfig = {
    port: DEFAULT_PORT,
    basicAuthParser: true,
    jsonBodyParser: true,
    secure: false,
    secureHeaders: {
        frameGuard: true,
        maskPoweredBy: true,
        noCache: true,
        xssFilter: true
    }
};

/**
 * Express.js-based application server
 */
export class Server extends EventEmitter {

    private serverConfig : IServerConfig;
    private readonly app : express.Application;

    /**
     * Construct a server instance
     */
    constructor(customServerConfig: IServerConfig = defaultServerConfig) {
        super();

        this.serverConfig = {
            ...defaultServerConfig,
            ...customServerConfig,
            secureHeaders: { ...defaultServerConfig.secureHeaders, ...customServerConfig.secureHeaders }
        };

        this.app = express();
        this.app.locals = { appId: uuidV4() };

        const headersConfig: IServerHeadersConfig = <IServerHeadersConfig>this.serverConfig.secureHeaders;

        // parser request content
        if (this.serverConfig.basicAuthParser) this.app.use(this.parseBasicAuthHeader);
        if (this.serverConfig.jsonBodyParser) this.app.use(bodyParser.json());

        // security headlers
        if (headersConfig.noCache) this.app.use(helmet.noCache());
        if (headersConfig.frameGuard) this.app.use(helmet.frameguard());
        if (headersConfig.xssFilter) this.app.use(helmet.xssFilter());
        if (headersConfig.maskPoweredBy) this.app.use(helmet.hidePoweredBy({ setTo: <string>this.app.locals.appId }));
    }

    /**
     * Get server configuration
     */
    public getServerConfig() : IServerConfig {
        return this.serverConfig;
    }

    /**
     * Configure SSL/TLS credentials for HTTPS
     * @param httpsConfig HTTPS configuration
     */
    public setHTTPSCredentials(httpsConfig: IHTTPSConfig) : Server {
        this.serverConfig.httpsConfig = httpsConfig;
        return this;
    }

    /**
     * Start the server
     * @param listenerConfig Server listener configuration
     */
    public listen(listenerConfig : IListnerConfig) : (http.Server | https.Server) {
        this.serverConfig = { ...listenerConfig, host: DEFAULT_HOST };
        let server : (http.Server | https.Server);

        if (Boolean(this.serverConfig.httpsConfig)) {
            const {key, cert} = <IHTTPSConfig>this.serverConfig.httpsConfig;
            server = https.createServer({
                key: readFileSync(key),
                cert: readFileSync(cert)
            }, this.app);
        } else {
            server = http.createServer(this.app);
        }

        // todo: need to find the best way to bind event handlers to server instance
        return server
            .listen(this.serverConfig.port, this.serverConfig.host)
            .on('listening', this.emit.bind(this, 'listening'))
            .on('connection', this.emit.bind(this, 'connection'))
            .on('error', this.emit.bind(this, 'error'))
            .on('close', this.emit.bind(this, 'close'));
    }

    /**
     * Convenient function to register more than one route
     * @param routeConfig Route configuration
     */
    public routes(routeConfig: IRouteConfig[]) : Server {
        routeConfig.forEach((route : IRouteConfig) => this.registerRoute(route));
        return this;
    }

    /**
     * Define a route
     * @param routeConfig Route configuration
     */
    public route(routeConfig: IRouteConfig) : Server {
        return this.registerRoute(<IRouteConfig>routeConfig);
    }

    /**
     * Define a server middleware
     * @param middlewareFn Middleware function
     */
    public middleware(middlewareFn : IMiddleware) : Server {
        this.app.use(middlewareFn);
        return this;
    }

    /**
     * Parse HTTP basic authorization header if exists
     * @param req HTTP Request object
     * @param res HTTP Response object
     * @param next Function to call the next middleware
     */
    private parseBasicAuthHeader(req: Request, res: Response, next: Function) : void {
        const authHeader: (string|undefined) = req.headers.authorization;
        try {
            res.locals.auth = {
                header: authHeader,
                ...basicAuthParser(authHeader)
            };
            next();
        } catch (err) {
            next();
        }
    }

    /**
     * Internal function to configure routes
     * @param routeConfig Route configuration
     */
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
        (<Function>(applicationListener.bind(this.app)))(path, handler);
        return this;
    }
}

"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const helmet = __importStar(require("helmet"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const uuid_1 = require("uuid");
const DEFAULT_HOST = '0.0.0.0';
class Server {
    constructor() {
        this.app = express_1.default();
        this.app.locals = {
            appId: uuid_1.v4()
        };
        this.app
            .use(bodyParser.json())
            .use(helmet.noCache())
            .use(helmet.frameguard())
            .use(helmet.xssFilter())
            .use(helmet.hidePoweredBy({ setTo: this.app.locals.appId }));
    }
    getServerConfig() {
        return this.serverConfig;
    }
    setHTTPSCredentials(httpsConfig) {
        this.serverConfig.httpsConfig = httpsConfig;
        return this;
    }
    listen(listenerConfig) {
        this.serverConfig = Object.assign({}, listenerConfig, { host: DEFAULT_HOST });
        let server;
        if (this.serverConfig.httpsConfig) {
            const { key, cert } = this.serverConfig.httpsConfig;
            server = https.createServer({
                key: fs_1.readFileSync(key),
                cert: fs_1.readFileSync(cert)
            }, this.app);
        }
        else {
            server = http.createServer(this.app);
        }
        return server.listen(this.serverConfig.port, this.serverConfig.host);
    }
    route(routeConfig) {
        const { method, path, handler } = routeConfig;
        let applicationListener = this.app.get;
        switch (method) {
            case 'post':
                applicationListener = this.app.post;
                break;
            case 'put':
                applicationListener = this.app.put;
                break;
            case 'delete':
                applicationListener = this.app.delete;
                break;
            case 'get':
            default:
                applicationListener = this.app.get;
        }
        applicationListener.bind(this.app)(path, handler);
        return this;
    }
    middleware(middlewareFn) {
        this.app.use(middlewareFn);
        return this;
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map
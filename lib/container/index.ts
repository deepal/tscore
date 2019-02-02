import { EventEmitter } from 'events';
import { join } from 'path';
import { IConfigLoader, IConfigObj } from '../configLoader';
import * as Constants from '../constants';
import { IApplicationConfig } from '../launcher';
import { ILogger, ILoggerConfig, Logger } from '../logger';
import { IModule } from '../module';

export interface IContainer {
    baseDir: string;
    logger(): ILogger;
    config(module: string): (object | undefined);
    module(moduleName: string): IModule;
}

export interface IConstructible<T> {
    prototype: T;
    new (container: IContainer, logger: ILogger, config: (IConfigObj | undefined)): T;
}

export interface IESModule<T> {
    default: IConstructible<T>;
    __esModule: true;
}

/**
 * Internal module for dependency injection
 */
export class Container extends EventEmitter implements IContainer {
    public baseDir : string;
    private readonly modules : Map<string, IModule> = new Map<string, IModule>();
    private readonly store : Map<string, Object|Function>  = new Map<string, Object|Function>();
    private loggerObj : ILogger;
    private configObj : IConfigObj;

    /**
     * Initialize container
     * @param applicationConfig Application configuration
     */
    public async init(applicationConfig : IApplicationConfig) : Promise<void> {
        this.baseDir = applicationConfig.baseDir;

        if (Boolean(applicationConfig.configLoader)) {
            await this.loadConfig(<IConfigLoader>applicationConfig.configLoader);
        }

        this.initializeLogger({
            ...applicationConfig.loggerConfig,
            name: applicationConfig.name
        });

        for (const module of applicationConfig.moduleDescription) {
            this.injectModule(
                module.name,
                module.path
            );
        }

        this.emit(Constants.EVENT.APPLICATION_START);
    }

    /**
     * Set container-local variables
     * @param key Object key
     * @param value Object value
     */
    public set(key: string, value: Object|Function) : void {
        this.store.set(key, value);
    }

    /**
     * Get container-local variable by key
     * @param key Object key
     */
    public get(key: string) : Object|Function|undefined {
        return this.store.get(key);
    }

    /**
     * Return logger instance
     */
    public logger() : ILogger {
        return this.loggerObj;
    }

    /**
     * Return config object
     */
    public config() : (object | undefined) {
        return this.configObj;
    }

    /**
     * Return loaded module by name
     * @param moduleName Module name
     */
    public module(moduleName : string) : IModule {
        if (this.modules.has(moduleName)) {
            return <IModule>this.modules.get(moduleName);
        }

        throw new Error(`no such module as : ${moduleName}`);
    }

    /**
     * Setup logger
     * @param loggerConfig Logger configuration
     */
    private initializeLogger(loggerConfig: ILoggerConfig) : Container {
        this.loggerObj = new Logger(loggerConfig);
        return this;
    }

    /**
     * Inject module into the container
     * @param name Module name
     * @param modulePath Path of module
     */
    private injectModule(name : string, modulePath : string) : Container {
        try {
            let moduleConfig : (IConfigObj|undefined);
            let moduleClass : IConstructible<IModule>;
            const loadedModule : (IConstructible<IModule> | IESModule<IModule>) = require(join(this.baseDir, modulePath));      //tslint:disable-line

            if (loadedModule.hasOwnProperty('__esModule')) {
                moduleClass = (<IESModule<IModule>>loadedModule).default;
            } else {
                moduleClass = <IConstructible<IModule>>loadedModule;
            }

            if (Boolean(this.configObj) && this.configObj.hasOwnProperty(name)) {
                moduleConfig = <IConfigObj|undefined>this.configObj[name];
            }

            const moduleInstance : IModule = new moduleClass(this, this.logger(), moduleConfig);

            if (this.modules.has(name)) {
                throw new Error(`failed to load module '${name}'. a module with the same name is already loaded`);
            }
            this.modules.set(name, moduleInstance);
        } catch (err) {
            console.error(`initialization failed. failed to load module : ${name}`, err);
        }

        return this;
    }

    /**
     * Load configuration
     * @param configLoader Config Loader instance
     */
    private async loadConfig(configLoader: IConfigLoader) : Promise<Container> {
        this.configObj = await configLoader.loadConfig(this);
        return this;
    }
}

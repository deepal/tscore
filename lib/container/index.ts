import {EventEmitter} from 'events';
import {join} from 'path';
import {ConfigLoader, IConfigObj} from '../configLoader';
import * as Constants from '../constants';
import {IApplicationConfig} from '../launcher';
import {ILogger, ILoggerConfig, Logger} from '../logger';
import {IModule} from '../module';

const START_EVENT : string = 'APPLICATION:START';

export interface IContainer {
    logger(): ILogger;
    config(module: string): (object | undefined);
    module(moduleName: string): IModule;
}

/**
 * Internal module for dependency injection
 */
export class Container extends EventEmitter implements IContainer {
    private readonly modules : Map<string, IModule> = new Map<string, IModule>();
    private readonly store : Map<string, Object|Function>  = new Map<string, Object|Function>();
    private loggerObj : ILogger;
    private configObj : IConfigObj;
    private baseDir : string;

    public init(applicationConfig : IApplicationConfig) : void {
        this.baseDir = applicationConfig.baseDir;

        this
            .loadConfig(applicationConfig.configPath)
            .initializeLogger(applicationConfig.loggerConfig);

        for (const module of applicationConfig.moduleDescription) {
            this.injectModule(
                module.name,
                module.path
            );
        }

        this.emit(Constants.EVENT.APPLICATION_START);
    }

    public set(key: string, value: Object|Function) : void {
        this.store.set(key, value);
    }

    public get(key: string) : Object|Function|undefined {
        return this.store.get(key);
    }

    public logger() : ILogger {
        return this.loggerObj;
    }

    public config() : (object | undefined) {
        return this.configObj;
    }

    public module(moduleName : string) : IModule {
        if (this.modules.has(moduleName)) {
            return <IModule>this.modules.get(moduleName);
        }

        throw new Error(`no such module as : ${moduleName}`);
    }

    private initializeLogger(loggerConfig: ILoggerConfig) : Container {
        this.loggerObj = new Logger(loggerConfig);
        return this;
    }

    private injectModule(name : string, modulePath : string) : Container {
        try {
            const moduleClass = require(join(this.baseDir, modulePath)).default      // tslint:disable-line
            const moduleConfig : (IConfigObj|undefined) = <IConfigObj|undefined>this.configObj[name];
            const moduleInstance : (typeof moduleClass) = new moduleClass(this, this.logger(), moduleConfig);

            if (this.modules.has(name)) {
                throw new Error(`failed to load module '${name}'. a module with the same name is already loaded`);
            }
            this.modules.set(name, moduleInstance);
        } catch (err) {
            console.error(`initialization failed. failed to load module : ${name}`, err);
        }

        return this;
    }

    private loadConfig(configPath: string) : Container {
        const configLoader : ConfigLoader = new ConfigLoader(join(this.baseDir, configPath));
        this.configObj = configLoader.loadConfig();
        return this;
    }
}

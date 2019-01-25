import {resolve} from 'app-root-path';
import { ConfigLoader } from '../configLoader';
import { IConfigObj } from '../configLoader/types';
import { IApplicationConfig, IModuleDescription } from '../launcher/types';
import { Logger } from '../logger';
import { ILogger, ILoggerConfig } from '../logger/types';
import { IModule } from '../module/types';
import { IContainer } from './types';

export class Container implements IContainer {
    private modules : Map<string, IModule> = new Map<string, IModule>();
    private loggerObj : ILogger;
    private configObj : IConfigObj;

    public init(applicationConfig : IApplicationConfig) : void {
        this
        .loadConfig(applicationConfig.configPath)
        .initializeLogger(applicationConfig.loggerConfig);

        for (const module of applicationConfig.moduleDescription) {
            this.injectModule(
                module.name,
                module.path
            );
        }

        // inject main module
        this.injectModule(
            applicationConfig.mainModuleDescription.name,
            applicationConfig.mainModuleDescription.path
        );
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
            // todo: moduleClass should be of type IModule. Find out why it does not work!!!
            const moduleClass : any = require(resolve(modulePath))      // tslint:disable-line
            const moduleConfig : (IConfigObj|undefined) = <IConfigObj|undefined>this.configObj[name];
            const moduleInstance : IModule = new moduleClass(this, this.logger(), moduleConfig);

            if (this.modules.has(name)) {
                throw new Error(`failed to load module '${name}'. a module with the same name is already loaded`);
            }
            this.modules.set(name, moduleInstance);
        } catch (err) {
            throw new Error(`initialization failed. failed to load module : ${name}`);
        }

        return this;
    }

    private loadConfig(configPath: string) : Container {
        const configLoader : ConfigLoader = new ConfigLoader(configPath);
        this.configObj = configLoader.loadConfig();
        return this;
    }
}

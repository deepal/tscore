import { ConfigLoader } from '../configLoader';
import { ILogger } from '../logger/types';
import { Module } from '../module';
import { IModule } from '../module/types';
import { IContainer } from './types';

export class Container implements IContainer {
    private modulesAvailable : Map<string, IModule> = new Map<string, IModule>();
    private modulesActive : Map<string, IModule> = new Map<string, IModule>();
    private rootModule : IModule;
    private loggerObj : ILogger;
    private configObj : Object;

    public init() : void {

    }

    public logger() : ILogger {
        return this.loggerObj;
    }

    public config() : Object {
        return this.configObj;
    }

    public module(moduleName : string) : IModule {
        if (this.modulesActive.has(moduleName)) {
            return <IModule>this.modulesActive.get(moduleName);
        } else if (this.modulesAvailable.has(moduleName)) {
            throw new Error(`module '${moduleName}' is not loaded yet`);
        }

        throw new Error(`no such module as : ${moduleName}`);
    }

    private initializeLogger(customLogger? : ILogger) : Container {
        return this;
    }

    private injectModules() : Container {
        // todo: moduleClass should be of type IModule. Find out why it does not work!!!
        this.modulesActive.forEach((moduleClass : any, name : string) => {      // tslint:disable-line
            try {
                const moduleInstance : IModule = new moduleClass(this, this.logger());
                this.modulesActive.set(name, moduleInstance);
            } catch (err) {
                throw new Error(`initialization failed. failed to load module : ${name}`);
            }
        });

        return this;
    }

    private loadConfig(configLoader : ConfigLoader) : Container {
        return this;
    }
}

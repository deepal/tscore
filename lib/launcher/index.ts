import {Container} from '../container';
import {ILoggerConfig} from '../logger/types';
import { IApplicationConfig, IModuleDescription } from './types';

export class Launcher {
    private container : Container;
    private applicationConfig : IApplicationConfig;

    constructor() {
        this.container = new Container();
    }

    public withConfig(configPath: string) : Launcher {
        this.applicationConfig.configPath = configPath;
        return this;
    }

    public logger(loggerConfig: ILoggerConfig) : Launcher {
        this.applicationConfig.loggerConfig = loggerConfig;
        return this;
    }

    public module(moduleDescription: IModuleDescription) : Launcher {
        this.applicationConfig.moduleDescription.push(moduleDescription);
        return this;
    }

    public main(moduleDescription: IModuleDescription) : Launcher {
        this.applicationConfig.mainModuleDescription = moduleDescription;
        return this;
    }

    public start() : void {
        this.container.init(this.applicationConfig);
    }
}

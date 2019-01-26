import {Container} from '../container';
import {ILoggerConfig} from '../logger';

export interface IModuleDescription {
    name: string;
    path: string;
}

export interface IApplicationConfig {
    name: string;
    baseDir: string;
    configPath: string;
    moduleDescription: IModuleDescription[];
    mainModuleDescription: IModuleDescription;
    loggerConfig: ILoggerConfig;
}

export class Launcher {
    private container : Container;
    private applicationConfig : IApplicationConfig = {
        name: '',
        baseDir: '',
        configPath: '',
        loggerConfig: {
            level: 'trace',
            name: ''
        },
        moduleDescription: [],
        mainModuleDescription: { name: '', path: ''}
    };

    constructor() {
        this.container = new Container();
    }

    public onBaseDir(baseDir: string) : Launcher {
        this.applicationConfig.baseDir = baseDir;
        return this;
    }

    public withConfig(configPath: string) : Launcher {
        this.applicationConfig.configPath = configPath;
        return this;
    }

    public withLoggerConfig(loggerConfig: ILoggerConfig) : Launcher {
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

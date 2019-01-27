import { IConfigLoader } from '../configLoader';
import { Container } from '../container';
import { ILoggerConfig } from '../logger';

export interface IModuleDescription {
    name: string;
    path: string;
}

export interface IApplicationConfig {
    name: string;
    baseDir: string;
    configLoader?: IConfigLoader;
    moduleDescription: IModuleDescription[];
    loggerConfig: ILoggerConfig;
}

/**
 * Application launcher
 */
export class Launcher {
    private readonly container : Container;
    private readonly applicationConfig : IApplicationConfig = {
        name: '',
        baseDir: '',
        loggerConfig: {
            level: 'trace',
            name: ''
        },
        moduleDescription: []
    };

    /**
     * Construct a launcher instance
     */
    constructor() {
        this.container = new Container();
    }

    /**
     * Set base directory path for the application
     * @param baseDir Directory path
     */
    public onBaseDir(baseDir: string) : Launcher {
        this.applicationConfig.baseDir = baseDir;
        return this;
    }

    /**
     * Set local configuration file path
     * @param configLoader Local config file path
     */
    public withConfig(configLoader: IConfigLoader) : Launcher {
        this.applicationConfig.configLoader = configLoader;
        return this;
    }

    /**
     * Set logger configuration
     * @param loggerConfig Logger config
     */
    public withLoggerConfig(loggerConfig: ILoggerConfig) : Launcher {
        this.applicationConfig.loggerConfig = loggerConfig;
        return this;
    }

    /**
     * Define a module to be loaded
     * @param moduleDescription Module description
     */
    public module(moduleDescription: IModuleDescription) : Launcher {
        this.applicationConfig.moduleDescription.push(moduleDescription);
        return this;
    }

    /**
     * Start application
     */
    public start() : void {
        (async () : Promise<void> => {
            await this.container.init(this.applicationConfig);
        })();
    }
}

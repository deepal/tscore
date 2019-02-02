import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { IConfigLoader } from '../configLoader';
import { Container } from '../container';
import { ILoggerConfig } from '../logger';

export interface IModuleDescription {
    name: string;
    path: string;
}

export interface ILauncherConfig {
    name: string;
    baseDir?: string;
    loggerConfig?: ILoggerConfig;
}

export interface IApplicationConfig extends ILauncherConfig {
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
    private readonly applicationConfig : IApplicationConfig;
    private readonly defaultApplicationConfig : IApplicationConfig;
    private readonly DEFAULT_LOG_LEVEL : 'trace' = 'trace';

    /**
     * Construct a launcher instance
     */
    constructor(launcherConfig?: ILauncherConfig) {
        this.container = new Container();
        this.defaultApplicationConfig = {
            name: '',
            baseDir: process.cwd(),
            loggerConfig: {
                level: this.DEFAULT_LOG_LEVEL,
                name: ''
            },
            moduleDescription: []
        };

        const loggerConfig : ILoggerConfig = {
            ...this.defaultApplicationConfig.loggerConfig,
            ...(Boolean(launcherConfig) ? (<ILauncherConfig>launcherConfig).loggerConfig : {})
        };

        this.applicationConfig = {
            ...this.defaultApplicationConfig,
            ...launcherConfig,
            loggerConfig
        };
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
        // This function can ovderride the app name in logs
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
        this.sanitizeApplicationConfig(this.applicationConfig)
            .then(async (config: IApplicationConfig) => {
                return this.container.init(config);
            })
            .catch((err: Error) => {
                console.log(err);
            });
    }

    /**
     * Validates the application config and sets default values for undefined properties
     * @param config Application config to be sanitized
     */
    private async sanitizeApplicationConfig(config: IApplicationConfig) : Promise<IApplicationConfig> {
        const appConfig : IApplicationConfig = {...config};
        const readPackageJson : Function = promisify(readFile);
        if (appConfig.name.length === 0) {
            try {
                appConfig.name = JSON.parse(
                    (await readPackageJson(join(config.baseDir, 'package.json'))).toString()    // tslint:disable-line no-unsafe-any
                ).name;
            } catch (err) {
                throw new Error('[Launcher] Missing required parameter: \'name\'');
            }
        }

        return appConfig;
    }
}

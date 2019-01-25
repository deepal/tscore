import { ILoggerConfig } from '../logger/types';

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

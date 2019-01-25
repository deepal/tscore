import { ILogger } from '../logger/types';
import {IModule} from '../module/types';

export interface IContainer {
    logger(): ILogger;
    config(module: string): (object | undefined);
    module(moduleName: string): IModule;
}

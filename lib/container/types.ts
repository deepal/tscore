import { ILogger } from '../logger/types';
import {IModule} from '../module/types';

export interface IContainer {
    logger(): ILogger;
    config(): object;
    module(moduleName: string): IModule;
}

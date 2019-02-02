import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { IConfigLoader, IConfigObj } from '../..';
import { Container } from '../../..';
import { ILocalConfigLoaderOptions } from './types';

/**
 * Load local JS file as application configuration
 * @param configOptions Local config loader options
 */
export function jsConfigLoader(configOptions: ILocalConfigLoaderOptions) : IConfigLoader {
    const readConfig: Function = promisify(readFile);
    return {
        async loadConfig(container: Container) : Promise<IConfigObj> {
            return require(join(container.baseDir, configOptions.filePath));
        }
    };
}

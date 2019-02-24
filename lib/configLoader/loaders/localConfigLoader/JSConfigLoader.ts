import { join } from 'path';
import { Container } from '../../..';
import {
    IConfigLoader,
    IConfigObj,
    ILocalConfigLoaderOptions
} from '../../../types';

/**
 * Load local JS file as application configuration
 * @param configOptions Local config loader options
 */
export function jsConfigLoader(configOptions: ILocalConfigLoaderOptions) : IConfigLoader {
    return {
        async loadConfig(container: Container) : Promise<IConfigObj> {
            return require(join(container.baseDir, configOptions.filePath));        // tslint:disable-line
        }
    };
}

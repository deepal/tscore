import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { Container } from '../../..';
import { IConfigLoader, IConfigObj } from '../../../types';

export interface ILocalConfigLoaderOptions {
    filePath: string;
}

type IReadConfigFn = (configFilePath: string) => Promise<Buffer>;

/**
 * Load local JSON file as application configuration
 * @param configOptions Local config loader options
 */
export function jsonConfigLoader(configOptions: ILocalConfigLoaderOptions) : IConfigLoader {
    const readConfig: IReadConfigFn = promisify(readFile);
    return {
        async loadConfig(container: Container) : Promise<IConfigObj> {
            return <IConfigObj>JSON.parse((
                await readConfig(join(container.baseDir, configOptions.filePath))
            ).toString());
        }
    };
}

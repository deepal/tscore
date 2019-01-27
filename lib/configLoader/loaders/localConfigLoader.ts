
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { IConfigLoader, IConfigObj } from '..';
import { Container } from '../..';

export interface ILocalConfigLoaderOptions {
    filePath: string;
}

export function localConfigLoader(configOptions: ILocalConfigLoaderOptions) : IConfigLoader {
    const readConfig: Function = promisify(readFile);
    return {
        async loadConfig(container: Container) : Promise<IConfigObj> {
            return JSON.parse((
                await readConfig(join(container.baseDir, configOptions.filePath))
            ).toString());
        }
    };
}

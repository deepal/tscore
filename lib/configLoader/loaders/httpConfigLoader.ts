
import * as request from 'request';
import { promisify } from 'util';
import { IConfigLoader, IConfigObj } from '..';

export interface IHTTPConfigLoaderOptions {
    url: string;
    method: string;
    body?: object;
    headers?: object;
}

export function httpConfigLoader(configOptions: IHTTPConfigLoaderOptions) : IConfigLoader {
    const fetchConfig: Function = promisify(request.default);
    return {
        async loadConfig() : Promise<IConfigObj> {
            const { body } = await fetchConfig(configOptions);
            return JSON.parse(body);
        }
    };
}

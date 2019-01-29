
import * as request from 'request';
import { promisify } from 'util';
import { IConfigLoader, IConfigObj } from '..';

export interface IHTTPConfigLoaderOptions {
    url: string;
    method: string;
    body?: object;
    headers?: object;
}

/**
 * Load application configuration over an HTTP config API
 * @param configOptions Request options to load config over http
 * @returns Config Loader module
 * @example
 */
export function httpConfigLoader(configOptions: IHTTPConfigLoaderOptions) : IConfigLoader {
    const fetchConfig: Function = promisify(request.default);
    return {
        async loadConfig() : Promise<IConfigObj> {
            const { body } = await fetchConfig(configOptions);
            return JSON.parse(body);
        }
    };
}

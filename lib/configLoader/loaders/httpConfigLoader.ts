
import * as request from 'request';
import { promisify } from 'util';
import { IConfigLoader, IConfigObj } from '..';

export interface IHTTPConfigLoaderOptions {
    url: string;
    method: string;
    body?: object;
    headers?: object;
    json?: boolean;
}

type IFetchConfigFn = (configOptions: IHTTPConfigLoaderOptions) => Promise<request.ResponseAsJSON>;

/**
 * Load application configuration over an HTTP config API
 * @param configOptions Request options to load config over http
 * @returns Config Loader module
 * @example
 */
export function httpConfigLoader(configOptions: IHTTPConfigLoaderOptions) : IConfigLoader {
    const fetchConfig : IFetchConfigFn = promisify(request.default);
    return {
        async loadConfig() : Promise<IConfigObj> {
            const { body } = await fetchConfig({...configOptions, json: true});
            return <IConfigObj>body;
        }
    };
}

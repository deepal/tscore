import { Container } from '../container';
import { httpConfigLoader } from './loaders/httpConfigLoader';
import { jsConfigLoader } from './loaders/localConfigLoader/JSConfigLoader';
import { jsonConfigLoader } from './loaders/localConfigLoader/JSONConfigLoader';

export interface IConfigObj {
    [key: string]: (string|number|boolean|IConfigObj);
}

export interface IConfigLoader {
    loadConfig(container: Container) : Promise<IConfigObj>;
}

export {
    httpConfigLoader,
    jsConfigLoader as jsConfigLoader,
    jsonConfigLoader as jsonConfigLoader
};

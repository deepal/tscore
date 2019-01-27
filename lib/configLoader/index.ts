import { Container } from '../container';
import { httpConfigLoader } from './loaders/httpConfigLoader';
import { localConfigLoader } from './loaders/localConfigLoader';

export interface IConfigObj {
    [key: string]: (string|number|boolean|IConfigObj);
}

export interface IConfigLoader {
    loadConfig(container: Container) : Promise<IConfigObj>;
}

export {
    httpConfigLoader,
    localConfigLoader
};

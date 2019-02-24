import { httpConfigLoader } from './loaders/httpConfigLoader';
import { jsConfigLoader } from './loaders/localConfigLoader/JSConfigLoader';
import { jsonConfigLoader } from './loaders/localConfigLoader/JSONConfigLoader';

export {
    httpConfigLoader,
    jsConfigLoader as jsConfigLoader,
    jsonConfigLoader as jsonConfigLoader
};

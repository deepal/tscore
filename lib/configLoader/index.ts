import {readFile, readFileSync} from 'fs';
import {promisify} from 'util';

export interface IConfigObj {
    [key: string]: (string|number|boolean|IConfigObj);
}

export interface IConfigLoader {
    loadConfig() : IConfigObj;
    loadConfigAsync() : Promise<void>;
}

/**
 * Internal module for loading configurations
 */
export class ConfigLoader implements IConfigLoader {
    private readonly configPath : string;

    constructor(configPath : string) {
        this.configPath = configPath;
    }

    public loadConfig() : IConfigObj {
        return <IConfigObj>JSON.parse(
            readFileSync(this.configPath)
            .toString()
        );
    }

    public async loadConfigAsync() : Promise<void> {
        const readConfig : Function = promisify(readFile);
        return JSON.parse(await readConfig(this.configPath));        // tslint:disable-line
    }
}

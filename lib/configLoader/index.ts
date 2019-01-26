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

    /**
     * Create ConfigLoad instance
     * @param configPath configuration file path
     */
    constructor(configPath : string) {
        this.configPath = configPath;
    }

    /**
     * Load local configuration file
     */
    public loadConfig() : IConfigObj {
        return <IConfigObj>JSON.parse(
            readFileSync(this.configPath)
            .toString()
        );
    }

    /**
     * Load configuration via HTTP
     */
    public async loadConfigAsync() : Promise<void> {
        const readConfig : Function = promisify(readFile);
        return JSON.parse(await readConfig(this.configPath));        // tslint:disable-line
    }
}

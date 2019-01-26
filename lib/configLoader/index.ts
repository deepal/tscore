import {readFile, readFileSync} from 'fs';
import {promisify} from 'util';
import { IConfigLoader, IConfigObj } from './types';

export class ConfigLoader implements IConfigLoader {
    private configPath : string;

    constructor(configPath : string) {
        this.configPath = configPath;
    }

    public loadConfig() : IConfigObj {
        return JSON.parse(
            readFileSync(this.configPath)
            .toString()
        );
    }

    public async loadConfigAsync() : Promise<void> {
        const readConfig : Function = promisify(readFile);
        return JSON.parse(await readConfig(this.configPath));
    }
}

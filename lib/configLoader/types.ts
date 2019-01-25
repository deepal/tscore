export interface IConfigObj {
    [key: string]: (string|number|boolean|IConfigObj);
}

export interface IConfigLoader {
    loadConfig() : IConfigObj;
    loadConfigAsync() : Promise<void>;
}

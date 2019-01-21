interface IConfigLoaderBase {
    getConfig() : object;
    loadConfig() : Promise<object>;
}

interface ILocalConfigLoader extends IConfigLoaderBase {
    configFilePath : string;
}

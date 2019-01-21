export interface IModule {
    init() : void;
}

export interface IRootModule {
    init() : void;
    onModulesLoaded() : void;
}

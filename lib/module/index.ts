import { IConfigObj } from '../configLoader';
import { IContainer } from '../container';
import { ILogger } from '../logger';

export interface IModule {
    init() : void;
}

export class Module implements IModule {

    private container: IContainer;
    private logger: ILogger;
    private config: IConfigObj;

    constructor(container: IContainer, logger: ILogger, config: IConfigObj) {
        this.container = container;
        this.logger = logger;
        this.config = config;
    }

    public init() : void {
        throw new Error(`not implemented: ${this.constructor.name}`);
    }
}

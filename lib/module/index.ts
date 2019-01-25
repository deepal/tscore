import { IConfigObj, IContainer } from '../container/types';
import { ILogger } from '../logger/types';
import { IModule } from './types';

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

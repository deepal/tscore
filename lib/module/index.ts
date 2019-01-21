import { IContainer } from '../container/types';
import { ILogger } from '../logger/types';
import { IModule } from './types';

export class Module implements IModule {

    private container: IContainer;
    private logger: ILogger;

    constructor(container: IContainer, logger: ILogger) {
        this.container = container;
        this.logger = logger;
    }

    public init() : void {
        throw new Error(`not implemented: ${this.constructor.name}`);
    }
}

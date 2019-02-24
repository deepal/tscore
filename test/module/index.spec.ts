// tslint:disable no-function-expression newline-per-chained-call no-unnecessary-type-assertion
import { expect } from 'chai';
import { Container } from '../../lib/container';
import { Logger } from '../../lib/logger';
import { Module } from '../../lib/module';
import {
    IContainer,
    ILogger,
    IModule
} from '../../lib/types';

describe('module helper test suite', function() : void {
    it('should throw an error if the init is called', function() : void {
        const container : IContainer = new Container();
        const logger : ILogger = new Logger({
            name: 'test'
        });
        const module : IModule = new Module(container, logger, {});
        let error : (Error | undefined);
        try {
            module.init();
        } catch (err) {
            error = <Error>err;
        }
        expect(error).to.be.instanceOf(Error);
        expect((<Error>error).message).to.equal('not implemented: Module');
    });
});

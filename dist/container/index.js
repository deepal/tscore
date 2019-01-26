"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const path_1 = require("path");
const configLoader_1 = require("../configLoader");
const logger_1 = require("../logger");
const START_EVENT = 'APPLICATION:START';
class Container extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.modules = new Map();
    }
    init(applicationConfig) {
        this.baseDir = applicationConfig.baseDir;
        this
            .loadConfig(applicationConfig.configPath)
            .initializeLogger(applicationConfig.loggerConfig);
        // inject depending modules
        for (const module of applicationConfig.moduleDescription) {
            this.injectModule(module.name, module.path);
        }
        // this event is supposed to be listened by the main module to start the main script
        this.emit(START_EVENT);
    }
    logger() {
        return this.loggerObj;
    }
    config() {
        return this.configObj;
    }
    module(moduleName) {
        if (this.modules.has(moduleName)) {
            return this.modules.get(moduleName);
        }
        throw new Error(`no such module as : ${moduleName}`);
    }
    initializeLogger(loggerConfig) {
        this.loggerObj = new logger_1.Logger(loggerConfig);
        return this;
    }
    injectModule(name, modulePath) {
        try {
            // todo: moduleClass should be of type IModule. Find out why it does not work!!!
            const moduleClass = require(path_1.join(this.baseDir, modulePath)).default; // tslint:disable-line
            const moduleConfig = this.configObj[name];
            const moduleInstance = new moduleClass(this, this.logger(), moduleConfig);
            if (this.modules.has(name)) {
                throw new Error(`failed to load module '${name}'. a module with the same name is already loaded`);
            }
            this.modules.set(name, moduleInstance);
        }
        catch (err) {
            throw new Error(`initialization failed. failed to load module : ${name}`);
        }
        return this;
    }
    loadConfig(configPath) {
        const configLoader = new configLoader_1.ConfigLoader(path_1.join(this.baseDir, configPath));
        this.configObj = configLoader.loadConfig();
        return this;
    }
}
exports.Container = Container;
//# sourceMappingURL=index.js.map
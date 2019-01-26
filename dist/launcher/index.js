"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../container");
class Launcher {
    constructor() {
        this.applicationConfig = {
            name: '',
            baseDir: '',
            configPath: '',
            loggerConfig: {
                level: 'trace',
                name: ''
            },
            moduleDescription: [],
            mainModuleDescription: { name: '', path: '' }
        };
        this.container = new container_1.Container();
    }
    onBaseDir(baseDir) {
        this.applicationConfig.baseDir = baseDir;
        return this;
    }
    withConfig(configPath) {
        this.applicationConfig.configPath = configPath;
        return this;
    }
    withLoggerConfig(loggerConfig) {
        this.applicationConfig.loggerConfig = loggerConfig;
        return this;
    }
    module(moduleDescription) {
        this.applicationConfig.moduleDescription.push(moduleDescription);
        return this;
    }
    main(moduleDescription) {
        this.applicationConfig.mainModuleDescription = moduleDescription;
        return this;
    }
    start() {
        this.container.init(this.applicationConfig);
    }
}
exports.Launcher = Launcher;
//# sourceMappingURL=index.js.map
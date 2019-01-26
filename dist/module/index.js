"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor(container, logger, config) {
        this.container = container;
        this.logger = logger;
        this.config = config;
    }
    init() {
        throw new Error(`not implemented: ${this.constructor.name}`);
    }
}
exports.Module = Module;
//# sourceMappingURL=index.js.map
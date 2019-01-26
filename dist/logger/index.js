"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = __importStar(require("bunyan"));
class Logger {
    constructor(options) {
        const { name, level, filePath } = options;
        const streams = [
            {
                stream: process.stdout,
                level: options.level
            },
            {
                stream: process.stderr,
                level: 'error'
            }
        ];
        if (!!filePath) {
            streams.push({
                path: options.filePath,
                level: options.level
            });
        }
        const logger = bunyan.createLogger({ name, streams });
        const { trace, debug, info, warn, error, fatal } = logger;
        this.trace = trace.bind(logger);
        this.debug = debug.bind(logger);
        this.info = info.bind(logger);
        this.warn = warn.bind(logger);
        this.error = error.bind(logger);
        this.fatal = fatal.bind(logger);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=index.js.map
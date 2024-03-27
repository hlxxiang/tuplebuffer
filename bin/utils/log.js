"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    static get instance() {
        if (!this._instance) {
            this._instance = new Log();
        }
        return this._instance;
    }
    debug(message) {
        console.debug("\x1B[34m%s\x1B[0m", message);
    }
    log(message) {
        console.log("\x1B[36m%s\x1B[0m", message);
    }
    warn(message) {
        console.error("\x1B[33m%s\x1B[0m", message);
    }
    error(message) {
        console.error("\x1B[31m%s\x1B[0m", message);
    }
}
exports.Log = Log;
//# sourceMappingURL=log.js.map
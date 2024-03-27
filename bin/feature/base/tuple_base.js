"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleBase = void 0;
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
class TupleBase {
    constructor(namespace, path, fileName) {
        this.namespace = namespace;
        this.path = path;
        this.fileName = fileName;
    }
    compileDeclare(indexSuffix, exportType) {
        for (const tuple of compile_1.declareTypes) {
            this.compileTuple(tuple, indexSuffix, exportType);
        }
        for (let v of compile_1.checkTupleNames) {
            if (v[1] == 0) {
                log_1.Log.instance.warn(`${v[0]} 未使用`);
            }
        }
    }
}
exports.TupleBase = TupleBase;
//# sourceMappingURL=tuple_base.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumBase = void 0;
const enum_1 = require("../../compiler/enum");
class EnumBase {
    constructor(namespace, path, fileName) {
        this.content = "";
        this.fieldList = new Map();
        this.namespace = namespace;
        this.path = path;
        this.fileName = fileName;
    }
    addContent(content) {
        this.content += content;
    }
    compileEnum() {
        let result = "";
        for (const tuple of enum_1.declareEnums) {
            result += this.compileEnumIndex(tuple);
        }
        return result;
    }
}
exports.EnumBase = EnumBase;
//# sourceMappingURL=enum_base.js.map
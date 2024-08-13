"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuple = exports.checkTupleNames = exports.declareTypes = exports.table = exports.array = exports.buffer = exports.boolean = exports.double = exports.float = exports.uint64 = exports.int64 = exports.uint32 = exports.int32 = exports.string = exports.T = void 0;
const log_1 = require("../utils/log");
exports.T = "    ";
function builtinCommon(metaType, className) {
    let result = function (name, comment, exportType = 3, check = null, assignType = 1) {
        return {
            metaType: metaType,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        };
    };
    result.metaType = metaType;
    result.className = className;
    return result;
}
exports.string = (() => {
    return builtinCommon(1, "string");
})();
exports.int32 = (() => {
    return builtinCommon(2, "int32");
})();
exports.uint32 = (() => {
    return builtinCommon(3, "uint32");
})();
exports.int64 = (() => {
    return builtinCommon(4, "int64");
})();
exports.uint64 = (() => {
    return builtinCommon(5, "uint64");
})();
exports.float = (() => {
    return builtinCommon(6, "float");
})();
exports.double = (() => {
    return builtinCommon(7, "double");
})();
exports.boolean = (() => {
    return builtinCommon(8, "boolean");
})();
exports.buffer = (() => {
    return builtinCommon(9, "buffer");
})();
function array(varType) {
    let result = function (name, comment, exportType = 3, check = null, assignType = 1) {
        return {
            metaType: 10,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        };
    };
    if (12 == varType.metaType) {
        exports.checkTupleNames.set(varType.className, exports.checkTupleNames.get(varType.className) + 1);
    }
    result.metaType = 10;
    result.className = "array";
    result.element = varType;
    return result;
}
exports.array = array;
function table(varType) {
    let result = function (name, comment, exportType = 3, check = null, assignType = 1) {
        return {
            metaType: 11,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        };
    };
    if (12 == varType.metaType) {
        exports.checkTupleNames.set(varType.className, exports.checkTupleNames.get(varType.className) + 1);
    }
    result.metaType = 11;
    result.className = "table";
    result.value = varType;
    return result;
}
exports.table = table;
exports.declareTypes = [];
exports.checkTupleNames = new Map();
function tuple(className, fields, comment) {
    if (exports.declareTypes.find((e) => e.className == className) != null) {
        log_1.Log.instance.error(`类型名${className}重复。`);
        throw new Error(`类型名${className}重复。`);
    }
    exports.checkTupleNames.set(className, 0);
    let result = function (name, comment, exportType = 3, check = null, assignType = 1) {
        return {
            metaType: 12,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        };
    };
    result.metaType = 12;
    result.className = className;
    result.fields = fields;
    result.comment = comment;
    exports.declareTypes.push(result);
    return result;
}
exports.tuple = tuple;
//# sourceMappingURL=compile.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enums = exports.declareEnums = exports.enumItem = void 0;
const log_1 = require("../utils/log");
function builtinEnum() {
    let result = function (name, comment, value, otherItem, check) {
        return {
            metaType: 11,
            name: name,
            value: value,
            otherItem: otherItem,
            comment: comment,
            meta: result,
            assignType: 1,
            exportType: 3,
            check: check,
        };
    };
    result.metaType = 11;
    result.className = "enum";
    return result;
}
exports.enumItem = (() => {
    return builtinEnum();
})();
exports.declareEnums = [];
function enums(className, fields, comment) {
    if (exports.declareEnums.find((e) => e.className == className) != null) {
        log_1.Log.instance.error(`类型名${className}重复。`);
        throw new Error(`类型名${className}重复。`);
    }
    let result = function (name, comment, value, otherItem, check) {
        return {
            metaType: 3,
            value: value,
            otherItem: otherItem,
            name: name,
            comment: comment,
            meta: result,
            assignType: 1,
            exportType: 3,
            check: check,
        };
    };
    result.metaType = 10;
    result.fields = fields;
    result.comment = comment;
    result.className = className;
    exports.declareEnums.push(result);
    return result;
}
exports.enums = enums;
//# sourceMappingURL=enum.js.map
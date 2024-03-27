"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const compile_1 = require("../../compiler/compile");
var Util;
(function (Util) {
    Util.Test = (0, compile_1.tuple)("Test", [
        (0, compile_1.int64)("id", "id"),
        (0, compile_1.int64)("num", "数值"),
        (0, compile_1.string)("str", "字符串"),
    ], "测试");
    Util.Attr = (0, compile_1.tuple)("Attr", [
        (0, compile_1.int64)("attrId", "属性ID"),
        (0, compile_1.int64)("value", "属性值"),
    ], "属性");
    Util.Vector3 = (0, compile_1.tuple)("Vector3", [
        (0, compile_1.float)("x", "坐标X"),
        (0, compile_1.float)("y", "坐标Y"),
        (0, compile_1.float)("z", "坐标Z"),
    ], "三维坐标");
})(Util || (exports.Util = Util = {}));
//# sourceMappingURL=configuration_util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const compile_1 = require("../../compiler/compile");
var Util;
(function (Util) {
    Util.Vector3 = (0, compile_1.tuple)("Vector3", [
        (0, compile_1.float)("x", "坐标X"),
        (0, compile_1.float)("y", "坐标Y"),
        (0, compile_1.float)("z", "坐标Z"),
    ], "三维坐标");
    Util.Test = (0, compile_1.tuple)("Test", [
        (0, compile_1.int32)("num32", "id"),
        (0, compile_1.uint32)("uNum32", "数值"),
        (0, compile_1.int64)("id64", "id"),
        (0, compile_1.uint64)("uId64", "数值"),
        (0, compile_1.string)("str", "字符串"),
    ], "测试");
})(Util || (exports.Util = Util = {}));
//# sourceMappingURL=protocols_util.js.map
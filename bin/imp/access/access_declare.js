"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../../compiler/compile");
const access_1 = require("../../gen/access");
const access_util_1 = require("./access_util");
access_1.Access.record("ActorId", 0, [
    (0, compile_1.uint64)("objId"),
], "角色自增id表");
access_1.Access.record("Test", 1, [
    access_util_1.Util.Test("test", "测试")
], "测试");
access_1.Access.record("Data", 1, [
    (0, compile_1.uint64)("objId"),
    (0, compile_1.int64)("a"),
    (0, compile_1.int32)("b"),
    (0, compile_1.uint32)("c"),
    access_util_1.Util.Vector3("pos", "坐标信息")
], "Data");
access_1.Access.record("Account", 1, [
    (0, compile_1.array)(access_util_1.Util.AccountInfo)("info"),
], "帐号表");
access_1.Access.record("TestList", 1, [
    (0, compile_1.uint64)("objId"),
], "测试");
//# sourceMappingURL=access_declare.js.map
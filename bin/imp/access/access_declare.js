"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../../compiler/compile");
const access_1 = require("../../gen/access");
const access_util_1 = require("./access_util");
access_1.Access.record("ActorId", 0, compile_1.int64, "角色自增id表");
access_1.Access.record("Scene", 1, [
    access_util_1.Util.Vector3("pos", "坐标信息")
], "场景信息");
access_1.Access.record("Data", 2, [
    access_util_1.Util.Vector3("pos", "坐标信息")
], "Data");
access_1.Access.record("Account", 1, (0, compile_1.array)((0, compile_1.tuple)("AccountInfo", [
    (0, compile_1.string)("account", "帐号名"),
    (0, compile_1.int64)("createTime", "创建时间"),
    (0, compile_1.int64)("uid", "角色id"),
], "账号")), "帐号表");
//# sourceMappingURL=access_declare.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const access_cpp_1 = require("../../feature/access/access_cpp");
const access_cs_1 = require("../../feature/access/access_cs");
const access_ts_1 = require("../../feature/access/access_ts");
const access_1 = require("../../gen/access");
access_1.Access.init("Access", "数据库记录结构定义", "IAccess", "Fields", "Native", [
    [0, "Key"],
    [1, "Hash"],
    [2, "List"],
]);
require("./access_declare");
access_1.Access.add(2, access_cs_1.AccessCS);
access_1.Access.add(1, access_cpp_1.AccessCPP);
access_1.Access.add(3, access_ts_1.AccessTS);
access_1.Access.compile("./export", 2);
access_1.Access.compile("./export", 1);
access_1.Access.compile("./export", 3);
//# sourceMappingURL=access.js.map
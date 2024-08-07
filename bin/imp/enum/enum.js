"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_cpp_1 = require("../../feature/enum/enum_cpp");
const enum_cs_1 = require("../../feature/enum/enum_cs");
const enum_ts_1 = require("../../feature/enum/enum_ts");
const enum_1 = require("../../gen/enum");
enum_1.Enum.init("Enum", "枚举");
require("./enum_util");
enum_1.Enum.add(2, enum_cs_1.EnumCS);
enum_1.Enum.add(1, enum_cpp_1.EnumCPP);
enum_1.Enum.add(3, enum_ts_1.EnumTS);
enum_1.Enum.compile("./export", 2);
enum_1.Enum.compile("./export", 1);
enum_1.Enum.compile("./export", 3);
//# sourceMappingURL=enum.js.map
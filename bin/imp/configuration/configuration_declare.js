"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../../compiler/compile");
const configuration_1 = require("../../gen/configuration");
const configuration_util_1 = require("./configuration_util");
configuration_1.Configuration.hashFile("G-怪物配置", "monster", "monsterId", (0, compile_1.tuple)("Monster", [
    (0, compile_1.int64)("monsterId", "怪物Id"),
    (0, compile_1.string)("name", "怪物名"),
    (0, compile_1.int64)("level", "怪物等级"),
    (0, compile_1.array)(configuration_util_1.Util.Attr)("attrs", "属性", 1),
    (0, compile_1.array)(compile_1.int64)("skills", "技能列表 id#id"),
    (0, compile_1.string)("model", "怪物模型", 2),
    configuration_util_1.Util.Vector3("pos", "坐标"),
    (0, compile_1.string)("head", "头像", 2),
    (0, compile_1.string)("desc", "描述", 0),
]), "怪物配置");
//# sourceMappingURL=configuration_declare.js.map
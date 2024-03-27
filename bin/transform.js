"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("./compiler/compile");
const assembly = require("./compiler/assembly");
const log_1 = require("./utils/log");
require("./environment");
let pri_all = [];
let all = [];
function run_all() {
    all.push(assembly.hashFile("monster", 3, "G-怪物配置.xlsx", "monsterId", [
        (0, compile_1.int64)("monsterId", "怪物Id", 3, null, 1),
        (0, compile_1.string)("name", "怪物名", 3, null, 1),
        (0, compile_1.int64)("level", "怪物等级", 3, null, 1),
        (0, compile_1.array)((0, compile_1.tuple)("Attr", [
            (0, compile_1.int64)("attrId", "属性ID", 3, null, 1),
            (0, compile_1.int64)("value", "属性值", 3, null, 1)
        ]))("attrs", "属性", 1, null, 1),
        (0, compile_1.array)(compile_1.int64)("skills", "技能列表 id#id", 3, null, 1),
        (0, compile_1.string)("model", "怪物模型", 2, null, 1),
        (0, compile_1.tuple)("Vector3", [
            (0, compile_1.float)("x", "坐标X", 3, null, 1),
            (0, compile_1.float)("y", "坐标Y", 3, null, 1),
            (0, compile_1.float)("z", "坐标Z", 3, null, 1)
        ])("pos", "坐标", 3, null, 1),
        (0, compile_1.string)("head", "头像", 2, null, 1),
        (0, compile_1.string)("desc", "描述", 0, null, 1)
    ]));
}
async function run() {
    await Promise.all(pri_all);
    run_all();
    await Promise.all(all);
    log_1.Log.instance.log("生成成功!");
}
run();
//# sourceMappingURL=transform.js.map
import * as compile from "./compiler/compile";
import { string, int32, int64, float, double, boolean, buffer, array, table, tuple } from "./compiler/compile";import * as assembly from "./compiler/assembly";
import { Log } from "./utils/log";
require("./environment");
let pri_all: Array<Promise<void>> = [];
let all: Array<Promise<void>> = [];

function run_all(): void {
all.push(assembly.hashFile("monster", 3, "G-怪物配置.xlsx", "monsterId",[
	int64("monsterId", "怪物Id", 3, null, 1),
	string("name", "怪物名", 3, null, 1),
	int64("level", "怪物等级", 3, null, 1),
	array(tuple("Attr",[
	int64("attrId", "属性ID", 3, null, 1),
	int64("value", "属性值", 3, null, 1)
]))("attrs", "属性", 1, null, 1),
	array(int64)("skills", "技能列表 id#id", 3, null, 1),
	string("model", "怪物模型", 2, null, 1),
	tuple("Vector3",[
	float("x", "坐标X", 3, null, 1),
	float("y", "坐标Y", 3, null, 1),
	float("z", "坐标Z", 3, null, 1)
])("pos", "坐标", 3, null, 1),
	string("head", "头像", 2, null, 1),
	string("desc", "描述", 0, null, 1)
]));
}
async function run(): Promise<void> {
    await Promise.all(pri_all);
    run_all();
    await Promise.all(all);
    Log.instance.log("生成成功!");
}
run();
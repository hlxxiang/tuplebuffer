import { array, int64, string, tuple } from "../../compiler/compile";
import { Configuration } from "../../gen/configuration";
import { Util } from "./configuration_util";

Configuration.hashFile("G-怪物配置", "monster",
    "monsterId",
    tuple("Monster", [
        int64("monsterId", "怪物Id"),
        string("name", "怪物名"),
        int64("level", "怪物等级"),
        array(Util.Attr)("attrs", "属性", ExportType.Server),
        array(int64)("skills", "技能列表 id#id"),
        string("model", "怪物模型", ExportType.Client),
        Util.Vector3("pos", "坐标"),
        string("head", "头像", ExportType.Client),
        string("desc", "描述", ExportType.Dummy),
    ]),
    "怪物配置"
);
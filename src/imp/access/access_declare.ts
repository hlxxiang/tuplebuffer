import { array, int64, string, tuple } from "../../compiler/compile";
import { Access } from "../../gen/access";
import { Util } from "./access_util";

Access.record(
    "ActorId",
    DataType.Key,
    int64,
    "角色自增id表"
);

Access.record(
    "Scene",
    DataType.Hash,
    [
        Util.Vector3("pos", "坐标信息")
    ],
    "场景信息"
);

Access.record(
    "Data",
    DataType.List,
    [
        Util.Vector3("pos", "坐标信息")
    ],
    "Data"
);

Access.record(
    "Account",
    DataType.Hash,
    array(
        tuple("AccountInfo", [
            string("account", "帐号名"),
            int64("createTime", "创建时间"),
            int64("uid", "角色id"),
        ], "账号")
    ),
    "帐号表"
);
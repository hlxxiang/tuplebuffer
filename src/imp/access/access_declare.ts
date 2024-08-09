import { array, int32, int64, string, tuple, uint32, uint64 } from "../../compiler/compile";
import { Access } from "../../gen/access";
import { Util } from "./access_util";

Access.record(
    "ActorId",
    DataType.Key,
    [
        uint64("objId"),
    ],
    "角色自增id表"
);

Access.record(
    "Test",
    DataType.Hash,
    [
        Util.Test("test", "测试")
    ],
    "测试"
);

Access.record(
    "Data",
    DataType.Hash,
    [
        uint64("objId"),
        int64("a"),
        int32("b"),
        uint32("c"),
        Util.Vector3("pos", "坐标信息")
    ],
    "Data"
);

Access.record(
    "Account",
    DataType.Hash,
    [
        array(Util.AccountInfo)("info"),
    ],
    "帐号表"
);

Access.record(
    "TestList",
    DataType.Hash,
    [
        uint64("objId"),
    ],
    "测试"
);
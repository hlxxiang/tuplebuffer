import { int64, string } from "../../../compiler/compile";
import { Protocols } from "../../../gen/protocols";
import { Util } from "../protocols_util";
import { Segment } from "../segment";

Protocols.protocol(
    "Ping", "心跳",
    GroupType.Client, ServerType.Gateway, Segment.Common_c2s,
);

Protocols.protocol(
    "Pong", "心跳",
    GroupType.System, ServerType.Client, Segment.Common_s2c,
);

Protocols.protocol(
    "Test3", "测试3",
    GroupType.Client, ServerType.Gateway, Segment.Common_c2s,
    [
        string("account", "账号"),
        Util.Test("test", "Test")
    ],
    [
        int64("code", "错误码"),
    ],
);

Protocols.protocol(
    "Test1", "测试1",
    GroupType.Client, ServerType.Gateway, Segment.Test_c2s,
    [
        string("test")
    ]
);

Protocols.protocol(
    "AuthClient", "客户端验证",
    GroupType.Client, ServerType.Gateway, Segment.Test_c2s,
    [
        string("account", "账号"),
    ],
    [
        int64("code", "错误码"),
    ],
);
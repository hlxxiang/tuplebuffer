import { int64, string } from "../../../compiler/compile";
import { Protocols } from "../../../gen/protocols";
import { ClientSegment, GatewaySegment } from "../segment";

Protocols.protocol(
    "Test1", "测试1",
    GroupType.Client, ServiceType.Gateway, GatewaySegment.Common,
    [
        string("test")
    ]
);

Protocols.protocol(
    "Test2", "测试2",
    GroupType.Client, ServiceType.Gateway, GatewaySegment.Common,
    [
        string("account", "账号"),
    ],
    [
        int64("code", "错误码"),
    ],
);

Protocols.protocol(
    "Test3", "测试3",
    GroupType.System, ServiceType.Client, ClientSegment.Common,
    [
        string("account", "账号"),
    ],
    [
        int64("code", "错误码"),
    ],
);

Protocols.protocol(
    "Test4", "测试4",
    GroupType.System, ServiceType.Client, ClientSegment.Common,
    [
        string("test", "test"),
    ]
)
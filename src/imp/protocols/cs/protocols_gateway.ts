import { int64, string } from "../../../compiler/compile";
import { Protocols } from "../../../gen/protocols";
import { GatewaySegment } from "../segment";

Protocols.protocol(
    "AuthClient", "客户端验证",
    GroupType.Client, ServiceType.Gateway, GatewaySegment.Common,
    [
        string("account", "账号"),
    ],
    [
        int64("code", "错误码"),
    ],
);

Protocols.protocol(
    "Ping", "客户端心跳",
    GroupType.Client, ServiceType.Gateway, GatewaySegment.Common
);
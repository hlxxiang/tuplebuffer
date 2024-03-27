"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../../../compiler/compile");
const protocols_1 = require("../../../gen/protocols");
const segment_1 = require("../segment");
protocols_1.Protocols.protocol("AuthClient", "客户端验证", 0, 1048576, segment_1.GatewaySegment.Common, [
    (0, compile_1.string)("account", "账号"),
], [
    (0, compile_1.int64)("code", "错误码"),
]);
protocols_1.Protocols.protocol("Ping", "客户端心跳", 0, 1048576, segment_1.GatewaySegment.Common);
//# sourceMappingURL=protocols_gateway.js.map
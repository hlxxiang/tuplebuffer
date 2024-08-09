"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../../../compiler/compile");
const protocols_1 = require("../../../gen/protocols");
const segment_1 = require("../segment");
protocols_1.Protocols.protocol("Ping", "心跳", 0, 1048576, segment_1.GatewaySegment.Common);
protocols_1.Protocols.protocol("Test1", "测试1", 0, 1048576, segment_1.GatewaySegment.Test, [
    (0, compile_1.string)("test")
]);
protocols_1.Protocols.protocol("Test2", "测试2", 0, 1048576, segment_1.GatewaySegment.Test, [
    (0, compile_1.string)("account", "账号"),
], [
    (0, compile_1.int64)("code", "错误码"),
]);
protocols_1.Protocols.protocol("Test3", "测试3", 16777216, 0, segment_1.ClientSegment.Test, [
    (0, compile_1.string)("account", "账号"),
], [
    (0, compile_1.int64)("code", "错误码"),
]);
protocols_1.Protocols.protocol("Test4", "测试4", 16777216, 0, segment_1.ClientSegment.Test, [
    (0, compile_1.string)("test", "test"),
]);
//# sourceMappingURL=protocols_gateway.js.map
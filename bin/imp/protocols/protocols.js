"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protocols_cpp_1 = require("../../feature/protocols/protocols_cpp");
const protocols_cs_1 = require("../../feature/protocols/protocols_cs");
const protocols_ts_1 = require("../../feature/protocols/protocols_ts");
const protocols_1 = require("../../gen/protocols");
protocols_1.Protocols.init("Protocols", "协议", "Types", "Rpcs", "Opcode", "Fields", "MsgFields", [
    [0, "Request", "请求"],
    [1, "Reply", "回应"],
], "ProtocolMask", [
    [117440512, "GroupMask", "高字节位 Group 类型"],
    [15728640, "ServiceMask", "中字节 Service 类型"],
], "BitMask", [
    [20, "ServiceType", "Service 类型"],
], "GroupType", [
    [0, "Client", "Group 类型: Client"],
    [16777216, "System", "Group 类型: System"],
    [33554432, "BG", "Group 类型: BG"],
], "ServiceType", [
    [0, "Client", "Service 类型: Client"],
    [1048576, "Gateway", "Service 类型: Gateway"],
    [20971520, "End", "End"]
], 1 << 20, Math.pow(2, 32) - 1);
require("./cs/protocols_gateway");
protocols_1.Protocols.add(1, protocols_cpp_1.ProtocolsCpp);
protocols_1.Protocols.add(2, protocols_cs_1.ProtocolsCS);
protocols_1.Protocols.add(3, protocols_ts_1.ProtocolsTS);
protocols_1.Protocols.compile("./export", 1);
protocols_1.Protocols.compile("./export", 2);
protocols_1.Protocols.compile("./export", 3);
//# sourceMappingURL=protocols.js.map
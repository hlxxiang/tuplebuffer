import { ProtocolsCpp } from "../../feature/protocols/protocols_cpp";
import { ProtocolsCS } from "../../feature/protocols/protocols_cs";
import { ProtocolsTS } from "../../feature/protocols/protocols_ts";
import { Protocols } from "../../gen/protocols";

Protocols.init(
    "Protocols",
    "协议",
    "IMessage",
    "Types",
    "Rpcs",
    "Opcode",
    "Fields",
    "MsgFields",
    [
        [MsgFields.Request, "Request", "请求"],
        [MsgFields.Reply, "Reply", "回应"],
    ],
    "ProtocolMask",
    [
        [ProtocolMask.SourceGroupMask, "SourceGroupMask", "高字节位 SourceGroup 类型"],
        [ProtocolMask.TargetServerMask, "TargetServerMask", "中字节 TargetServer 类型"],
    ],
    "BitMask",
    [
        [BitMask.SourceGroup, "SourceGroup", "SourceGroup 类型"],
        [BitMask.TargetServer, "TargetServer", "TargetServer 类型"],
    ],
    "GroupType",
    [
        [GroupType.Client, "Client", "Group 类型: Client"],
        [GroupType.System, "System", "Group 类型: System"],
        [GroupType.Bg, "BG", "Group 类型: BG"],
    ],
    "ServerType",
    [
        [ServerType.Client, "Client", "Client:客户端"],
        [ServerType.Gateway, "Gateway", "Gateway:网关"],
        [ServerType.BG, "BG", "BG: 后台"]
    ],
    1 << BitMask.TargetServer,
    Math.pow(2, 32) - 1,
);

/**************************************************协议声明**************************************************/
require("./cs/protocols_test");


Protocols.add(LangueType.CS, ProtocolsCS);
Protocols.add(LangueType.CPP, ProtocolsCpp);
Protocols.add(LangueType.TS, ProtocolsTS);

Protocols.compile("./export", LangueType.CS);
Protocols.compile("./export", LangueType.CPP);
Protocols.compile("./export", LangueType.TS);
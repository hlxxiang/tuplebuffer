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
        [ProtocolMask.TargetGroupMask, "TargetGroupMask", "中字节 TargetGroup 类型"],
    ],
    "BitMask",
    [
        [BitMask.SourceGroup, "SourceGroup", "SourceGroup 类型"],
        [BitMask.TargetGroup, "TargetGroup", "TargetGroup 类型"],
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
        [ServerType.CenterServer, "CenterServer", "CenterServer:中心服务,单个"],
        [ServerType.DBServer, "DBServer", "DBServer:DB服务,可多个"],
        [ServerType.HttpServer, "HttpServer", "HttpServer:Http服务,单个"],
        [ServerType.LoginServer, "LoginServer", "LoginServer:登录服务,可多个"],
        [ServerType.MapServer, "MapServer", "MapServer:战斗服务,可多个"],
        [ServerType.MatchServer, "MatchServer", "MatchServer:匹配服务,可多个"],
        [ServerType.UserServer, "UserServer", "UserServer:玩家数据,可多个"],
        [ServerType.End, "End", "End"]
    ],
    1 << BitMask.TargetGroup,
    Math.pow(2, 32) - 1,
);

/**************************************************协议声明**************************************************/
require("./cs/protocols_login");


Protocols.add(LangueType.CS, ProtocolsCS);
Protocols.add(LangueType.CPP, ProtocolsCpp);
Protocols.add(LangueType.TS, ProtocolsTS);

Protocols.compile("./export", LangueType.CS);
Protocols.compile("./export", LangueType.CPP);
Protocols.compile("./export", LangueType.TS);
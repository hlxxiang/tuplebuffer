declare namespace Gen {
    /* 协议 */
    namespace Protocols {

        const enum MsgFields {
            Request = 0x0,
            Reply = 0x1,
        }

        const enum ProtocolMask {
            SourceGroupMask = 0x700000,
            TargetServerMask = 0xf000000,
        }

        const enum BitMask {
            SourceGroup = 0x14,
            TargetServer = 0x18,
        }

        const enum GroupType {
            Client = 0x0,
            System = 0x1,
            BG = 0x2,
        }

        const enum ServerType {
            Client = 0x0,
            Gateway = 0x1,
            BG = 0x14,
        }

        /** 心跳 */
        const enum PingFields {
        }
        interface PingTypes {
        }
        /** 心跳 */
        type Ping = null;

        /** 心跳 */
        const enum PongFields {
        }
        interface PongTypes {
        }
        /** 心跳 */
        type Pong = null;

        /** 测试3 */
        const enum Test3Fields {
            /** 账号 */
            account = 0,
        }
        interface Test3Types {
            [Test3Fields.account]: string;
        }
        /** 测试3 */
        type Test3 = [string];

        /** RPC请求:测试3 */
        const enum Test3ReplyFields {
            /** 错误码 */
            code = 0,
        }
        interface Test3ReplyTypes {
            [Test3ReplyFields.code]: number;
        }
        /** RPC请求:测试3 */
        type Test3Reply = [number];

        /** 测试1 */
        const enum Test1Fields {
            test = 0,
        }
        interface Test1Types {
            [Test1Fields.test]: string;
        }
        /** 测试1 */
        type Test1 = [string];

        /** 客户端验证 */
        const enum AuthClientFields {
            /** 账号 */
            account = 0,
        }
        interface AuthClientTypes {
            [AuthClientFields.account]: string;
        }
        /** 客户端验证 */
        type AuthClient = [string];

        /** RPC请求:客户端验证 */
        const enum AuthClientReplyFields {
            /** 错误码 */
            code = 0,
        }
        interface AuthClientReplyTypes {
            [AuthClientReplyFields.code]: number;
        }
        /** RPC请求:客户端验证 */
        type AuthClientReply = [number];

        /*************************************** Client 协议命令 ***************************************/

        /** C to S  协议命令 */
        const enum C2SOpcode {
            /** 心跳 */
            Ping = 0x1000000,
            /** 测试3 */
            Test3 = 0x1000001,
            /** 测试1 */
            Test1 = 0x1000064,
            /** 客户端验证 */
            AuthClient = 0x1000065,
        }

        /*************************************** Client 协议命令 ***************************************/

        /*************************************** System 协议命令 ***************************************/

        /** S to C 协议命令 */
        const enum S2COpcode {
            /** 心跳 */
            Pong = 0x100000,
        }

        /*************************************** System 协议命令 ***************************************/

        /*************************************** BG 协议命令 ***************************************/

        /*************************************** BG 协议命令 ***************************************/

        /* C to S  协议 */
        interface C2SProtocols {
            [C2SOpcode.Ping]: [Ping],
            [C2SOpcode.Test3]: [Test3, Test3Reply],
            [C2SOpcode.Test1]: [Test1],
            [C2SOpcode.AuthClient]: [AuthClient, AuthClientReply],
        }

        /* S to C 协议 */
        interface S2CProtocols {
            [S2COpcode.Pong]: [Pong],
        }

    }
}
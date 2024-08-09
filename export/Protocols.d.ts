declare namespace Gen {
    /* 协议 */
    namespace Protocols {
        const enum MsgFields {
            Request = 0x0,
            Reply = 0x1,
        }

        const enum ProtocolMask {
            GroupMask = 0x7000000,
            ServiceMask = 0xf00000,
        }

        const enum BitMask {
            ServiceType = 0x14,
        }

        const enum GroupType {
            Client = 0x0,
            System = 0x1000000,
            BG = 0x2000000,
        }

        const enum ServiceType {
            Client = 0x0,
            Gateway = 0x100000,
            End = 0x1400000,
        }

        /** 心跳 */
        const enum PingFields {
        }
        interface PingTypes {
        }
        /** 心跳 */
        type Ping = null;

        /** 测试1 */
        const enum Test1Fields {
            test = 0,
        }
        interface Test1Types {
            [Test1Fields.test]: string;
        }
        /** 测试1 */
        type Test1 = [string];

        /** 测试2 */
        const enum Test2Fields {
            /** 账号 */
            account = 0,
        }
        interface Test2Types {
            [Test2Fields.account]: string;
        }
        /** 测试2 */
        type Test2 = [string];

        /** RPC请求:测试2 */
        const enum Test2ReplyFields {
            /** 错误码 */
            code = 0,
        }
        interface Test2ReplyTypes {
            [Test2ReplyFields.code]: number;
        }
        /** RPC请求:测试2 */
        type Test2Reply = [number];

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

        /** 测试4 */
        const enum Test4Fields {
            /** test */
            test = 0,
        }
        interface Test4Types {
            [Test4Fields.test]: string;
        }
        /** 测试4 */
        type Test4 = [string];

        /*************************************** Client 协议命令 ***************************************/

        const enum Opcode {
            /** 心跳 */
            Ping = 0x100000,
            /** 测试1 */
            Test1 = 0x100064,
            /** 测试2 */
            Test2 = 0x100065,
        }
        /*************************************** System 协议命令 ***************************************/

        const enum Opcode {
            /** 测试3 */
            Test3 = 0x1000064,
            /** 测试4 */
            Test4 = 0x1000065,
        }
        /*************************************** BG 协议命令 ***************************************/

        const enum Opcode {
        }
        /** 协议及结构 */

        interface Types {
            /** Client 协议结构 */
            [Opcode.Ping]: [Ping],
            [Opcode.Test1]: [Test1],
            [Opcode.Test2]: [Test2, Test2Reply],
            /** Client 协议结构 */

            /** System 协议结构 */
            [Opcode.Test3]: [Test3, Test3Reply],
            [Opcode.Test4]: [Test4],
            /** System 协议结构 */

            /** BG 协议结构 */
            /** BG 协议结构 */
        }
    }
}
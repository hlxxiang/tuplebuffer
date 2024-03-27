/*协议*/
declare namespace Protocols {
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


    /** 客户端验证
     */
    const enum AuthClientFields{
        /** 账号 */
        account = 0,

    }
    interface AuthClientTypes {
        [AuthClientFields.account]: string;
    }
    /** 客户端验证 */
    type AuthClient = [string];

    /** RPC返回:客户端验证
     */
    const enum AuthClientReplyFields{
        /** 错误码 */
        code = 0,

    }
    interface AuthClientReplyTypes {
        [AuthClientReplyFields.code]: number;
    }
    /** RPC返回:客户端验证 */
    type AuthClientReply = [number];

    /** 客户端心跳
     */
    const enum PingFields{

    }
    interface PingTypes {
    }
    /** 客户端心跳 */
    type Ping = null;
    /***************************************Client命令***************************************/

    const enum Opcode {
        /** 客户端验证 */
        AuthClient = 0x100000,
        /** 客户端心跳 */
        Ping = 0x100001,

    }

    /***************************************System命令***************************************/

    const enum Opcode {
    }

    /***************************************BG命令***************************************/

    const enum Opcode {
    }

    

}
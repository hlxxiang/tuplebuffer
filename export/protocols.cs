
using MessagePack;
using System.Collections.Generic;
/* 协议 */
namespace Protocols
{
    public enum MsgFields 
    {
        /// <summary>请求</summary>
        Request = 0x0,
        /// <summary>回应</summary>
        Reply = 0x1,
    }

    public enum ProtocolMask 
    {
        /// <summary>高字节位 Group 类型</summary>
        GroupMask = 0x7000000,
        /// <summary>中字节 Service 类型</summary>
        ServiceMask = 0xf00000,
    }

    public enum BitMask 
    {
        /// <summary>Service 类型</summary>
        ServiceType = 0x14,
    }

    public enum GroupType 
    {
        /// <summary>Group 类型: Client</summary>
        Client = 0x0,
        /// <summary>Group 类型: System</summary>
        System = 0x1000000,
        /// <summary>Group 类型: BG</summary>
        BG = 0x2000000,
    }

    public enum ServiceType 
    {
        /// <summary>Service 类型: Client</summary>
        Client = 0x0,
        /// <summary>Service 类型: Gateway</summary>
        Gateway = 0x100000,
        /// <summary>End</summary>
        End = 0x1400000,
    }

    /// <summary>
    /// 客户端验证
    /// </summary>*/
    [MessagePackObject]
    public class AuthClient 
    {
        /// <summary> 账号 </summary>
        [Key(0)]
        public string? account;
    }

    /// <summary>
    /// RPC返回:客户端验证
    /// </summary>*/
    [MessagePackObject]
    public class AuthClientReply 
    {
        /// <summary> 错误码 </summary>
        [Key(0)]
        public Int64? code;
    }

    /// <summary>
    /// 客户端心跳
    /// </summary>*/
    [MessagePackObject]
    public class Ping 
    {
    }

    /// <summary>   Client命令   </summary>

    public enum ClientOpcode {
        /// <summary> 客户端验证 </summary>
        AuthClient = 0x100000,
        /// <summary> 客户端心跳 </summary>
        Ping = 0x100001,
    }
    /// <summary>   System命令   </summary>

    public enum SystemOpcode {
    }
    /// <summary>   BG命令   </summary>

    public enum BGOpcode {
    }

    /// <summary>    命令类型    </summary>
    namespace Types
    {
        /// <summary> Client命令 </summary>
        /// <summary> RPC返回:客户端验证 </summary>
        using AuthClient = Tuple<AuthClient, AuthClientReply>;
        /// <summary> 客户端心跳 </summary>
        using Ping = Tuple<Ping>;
        /// <summary> System命令 </summary>
        /// <summary> BG命令 </summary>
    }
}

using MessagePack;
using System;
using System.Collections.Generic;
/* 协议 */
namespace Protocols
{
    /// <summary> 协议接口 </summary>
    public interface IProtocols
    {

    }

    /// <summary> 普通协议 </summary>
    /// <typeparam name="T1">发送协议参数类型</typeparam>
    /// <typeparam name="OP">协议号</typeparam>
    public class Send<T1, OP> : IProtocols
    {
        /// <summary> 发送的消息 </summary>
        public T1 Request;
    }

    /// <summary> RPC 协议 </summary>
    /// <typeparam name="T1">请求</typeparam>
    /// <typeparam name="T2">回应</typeparam>
    /// <typeparam name="OP">协议号</typeparam>
    public class Call<T1, T2, OP> : IProtocols
    {
        /// <summary> 发送的消息 </summary>
        public T1 Request;
        /// <summary> 返回的消息 </summary>
        public T2 Reply;
    }

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
    /// 测试1
    /// </summary>*/
    [MessagePackObject]
    public class Test1 
    {
        [Key(0)]
        public string? test { get; set; }
    }

    /// <summary>
    /// 测试2
    /// </summary>*/
    [MessagePackObject]
    public class Test2 
    {
        /// <summary> 账号 </summary>
        [Key(0)]
        public string? account { get; set; }
    }

    /// <summary>
    /// RPC返回:测试2
    /// </summary>*/
    [MessagePackObject]
    public class Test2Reply 
    {
        /// <summary> 错误码 </summary>
        [Key(0)]
        public Int64? code { get; set; }
    }

    /// <summary>
    /// 测试3
    /// </summary>*/
    [MessagePackObject]
    public class Test3 
    {
        /// <summary> 账号 </summary>
        [Key(0)]
        public string? account { get; set; }
    }

    /// <summary>
    /// RPC返回:测试3
    /// </summary>*/
    [MessagePackObject]
    public class Test3Reply 
    {
        /// <summary> 错误码 </summary>
        [Key(0)]
        public Int64? code { get; set; }
    }

    /// <summary>
    /// 测试4
    /// </summary>*/
    [MessagePackObject]
    public class Test4 
    {
        /// <summary> test </summary>
        [Key(0)]
        public string? test { get; set; }
    }

    /// <summary>   Client命令   </summary>

    public enum ClientOpcode
    {
        /// <summary> 测试1 </summary>
        Test1 = 0x100000,
        /// <summary> 测试2 </summary>
        Test2 = 0x100001,
    }
    /// <summary>   System命令   </summary>

    public enum SystemOpcode
    {
        /// <summary> 测试3 </summary>
        Test3 = 0x1000000,
        /// <summary> 测试4 </summary>
        Test4 = 0x1000001,
    }
    /// <summary>   BG命令   </summary>

    public enum BGOpcode
    {
    }

    /// <summary>    命令类型    </summary>
    namespace Types
    {
        /// <summary> Client命令 </summary>
        /// <summary> 测试1 </summary>
        public class Test1Oper : Send<Test1, ClientOpcode>
        {
            public const ClientOpcode Opcode = ClientOpcode.Test1;
        }
        /// <summary> RPC返回:测试2 </summary>
        public class Test2Oper : Call<Test2, Test2Reply, ClientOpcode>
        {
            public const ClientOpcode Opcode = ClientOpcode.Test2;
        }
        /// <summary> System命令 </summary>
        /// <summary> RPC返回:测试3 </summary>
        public class Test3Oper : Call<Test3, Test3Reply, SystemOpcode>
        {
            public const SystemOpcode Opcode = SystemOpcode.Test3;
        }
        /// <summary> 测试4 </summary>
        public class Test4Oper : Send<Test4, SystemOpcode>
        {
            public const SystemOpcode Opcode = SystemOpcode.Test4;
        }
        /// <summary> BG命令 </summary>
    }
}
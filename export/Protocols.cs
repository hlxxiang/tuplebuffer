using MessagePack;
using System;
using System.Collections.Generic;
namespace Gen
{
    /// <summary> 协议 </summary>
    namespace Protocols
    {
        #region 基础定义

        public enum MsgFields 
        {
            /// <summary> 请求 </summary>
            Request = 0x0,
            /// <summary> 回应 </summary>
            Reply = 0x1,
        }

        public enum ProtocolMask 
        {
            /// <summary> 高字节位 SourceGroup 类型 </summary>
            SourceGroupMask = 0x700000,
            /// <summary> 中字节 TargetGroup 类型 </summary>
            TargetGroupMask = 0xf000000,
        }

        public enum BitMask 
        {
            /// <summary> SourceGroup 类型 </summary>
            SourceGroup = 0x14,
            /// <summary> TargetGroup 类型 </summary>
            TargetGroup = 0x18,
        }

        public enum GroupType 
        {
            /// <summary> Group 类型: Client </summary>
            Client = 0x0,
            /// <summary> Group 类型: System </summary>
            System = 0x1,
            /// <summary> Group 类型: BG </summary>
            BG = 0x2,
        }

        public enum ServerType 
        {
            /// <summary> Client:客户端 </summary>
            Client = 0x0,
            /// <summary> Gateway:网关 </summary>
            Gateway = 0x1,
            /// <summary> End </summary>
            End = 0x14,
        }

        #endregion

        #region 自定义结构

        /// <summary> 心跳 </summary>
        [MessagePackObject(true)]
        public class Ping : IMessage
        {
        }

        /// <summary> 心跳 </summary>
        [MessagePackObject(true)]
        public class Pong : IMessage
        {
        }

        /// <summary> 测试3 </summary>
        [MessagePackObject(true)]
        public class Test3 : IMessage
        {
            /// <summary> 账号 </summary>
            [Key(0)]
            public string account { get; set; }
        }

        /// <summary> RPC请求:测试3 </summary>
        [MessagePackObject(true)]
        public class Test3Reply : IMessage
        {
            /// <summary> 错误码 </summary>
            [Key(0)]
            public Int64 code { get; set; }
        }

        /// <summary> 测试1 </summary>
        [MessagePackObject(true)]
        public class Test1 : IMessage
        {
            [Key(0)]
            public string test { get; set; }
        }

        /// <summary> 客户端验证 </summary>
        [MessagePackObject(true)]
        public class AuthClient : IMessage
        {
            /// <summary> 账号 </summary>
            [Key(0)]
            public string account { get; set; }
        }

        /// <summary> RPC请求:客户端验证 </summary>
        [MessagePackObject(true)]
        public class AuthClientReply : IMessage
        {
            /// <summary> 错误码 </summary>
            [Key(0)]
            public Int64 code { get; set; }
        }

        #endregion

        #region C to S  协议命令

        public enum C2SOpcode
        {
            /// <summary> 心跳 </summary>
            Ping = 0x1000000,
            /// <summary> 测试3 </summary>
            Test3 = 0x1000001,
            /// <summary> 测试1 </summary>
            Test1 = 0x1000064,
            /// <summary> 客户端验证 </summary>
            AuthClient = 0x1000065,
        }

        #endregion

        #region S to C 协议命令

        public enum S2COpcode
        {
            /// <summary> 心跳 </summary>
            Pong = 0x100000,
        }

        #endregion

        #region C to S  协议 

        namespace C2SProtocols 
        {
            /// <summary> 心跳 </summary>
            public class PingOper : Send<Ping, C2SOpcode>
            {
                public const C2SOpcode Opcode = C2SOpcode.Ping;
            }
            /// <summary> RPC请求:测试3 </summary>
            public class Test3Oper : Call<Test3, Test3Reply, C2SOpcode>
            {
                public const C2SOpcode Opcode = C2SOpcode.Test3;
            }
            /// <summary> 测试1 </summary>
            public class Test1Oper : Send<Test1, C2SOpcode>
            {
                public const C2SOpcode Opcode = C2SOpcode.Test1;
            }
            /// <summary> RPC请求:客户端验证 </summary>
            public class AuthClientOper : Call<AuthClient, AuthClientReply, C2SOpcode>
            {
                public const C2SOpcode Opcode = C2SOpcode.AuthClient;
            }
        }

        #endregion

        #region S to C 协议 

        namespace S2CProtocols 
        {
            /// <summary> 心跳 </summary>
            public class PongOper : Send<Pong, S2COpcode>
            {
                public const S2COpcode Opcode = S2COpcode.Pong;
            }
        }

        #endregion


    }
}
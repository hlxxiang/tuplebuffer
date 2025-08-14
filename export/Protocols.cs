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
            /// <summary> 高字节位 Group 类型 </summary>
            GroupMask = 0x7000000,
            /// <summary> 中字节 Server 类型 </summary>
            ServerMask = 0xf00000,
        }

        public enum BitMask 
        {
            /// <summary> Group 类型 </summary>
            GroupType = 0x18,
            /// <summary> Server 类型 </summary>
            ServerType = 0x14,
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
            /// <summary> BG: 后台 </summary>
            BG = 0x14,
        }

        #endregion

        #region 自定义结构

        /// <summary> 三维坐标 </summary>
        [MessagePackObject(true)]
        public class Vector3 : IMessage
        {
            /// <summary> 坐标X </summary>
            [Key(0)]
            public float x { get; set; }
            /// <summary> 坐标Y </summary>
            [Key(1)]
            public float y { get; set; }
            /// <summary> 坐标Z </summary>
            [Key(2)]
            public float z { get; set; }
        }

        /// <summary> 测试 </summary>
        [MessagePackObject(true)]
        public class Test : IMessage
        {
            /// <summary> id </summary>
            [Key(0)]
            public Int32 num32 { get; set; }
            /// <summary> 数值 </summary>
            [Key(1)]
            public UInt32 uNum32 { get; set; }
            /// <summary> id </summary>
            [Key(2)]
            public Int64 id64 { get; set; }
            /// <summary> 数值 </summary>
            [Key(3)]
            public UInt64 uId64 { get; set; }
            /// <summary> 字符串 </summary>
            [Key(4)]
            public string str { get; set; }
            /// <summary> 坐标 </summary>
            [Key(5)]
            public Vector3 position { get; set; }
        }

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
            /// <summary> Test </summary>
            [Key(1)]
            public Test test { get; set; }
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
            Ping = 0x100000,
            /// <summary> 测试3 </summary>
            Test3 = 0x100001,
            /// <summary> 测试1 </summary>
            Test1 = 0x100064,
            /// <summary> 客户端验证 </summary>
            AuthClient = 0x100065,
        }

        #endregion

        #region S to C 协议命令

        public enum S2COpcode
        {
            /// <summary> 心跳 </summary>
            Pong = 0x1000000,
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
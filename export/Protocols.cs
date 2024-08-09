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
            /// <summary> 中字节 Service 类型 </summary>
            ServiceMask = 0xf00000,
        }

        public enum BitMask 
        {
            /// <summary> Service 类型 </summary>
            ServiceType = 0x14,
        }

        public enum GroupType 
        {
            /// <summary> Group 类型: Client </summary>
            Client = 0x0,
            /// <summary> Group 类型: System </summary>
            System = 0x1000000,
            /// <summary> Group 类型: BG </summary>
            BG = 0x2000000,
        }

        public enum ServiceType 
        {
            /// <summary> Service 类型: Client </summary>
            Client = 0x0,
            /// <summary> Service 类型: Gateway </summary>
            Gateway = 0x100000,
            /// <summary> End </summary>
            End = 0x1400000,
        }

        #endregion

        #region 自定义结构

        /// <summary> 心跳 </summary>
        [MessagePackObject(true)]
        public class Ping : IMessage
        {
        }

        /// <summary> 测试1 </summary>
        [MessagePackObject(true)]
        public class Test1 : IMessage
        {
            [Key(0)]
            public string test { get; set; }
        }

        /// <summary> 测试2 </summary>
        [MessagePackObject(true)]
        public class Test2 : IMessage
        {
            /// <summary> 账号 </summary>
            [Key(0)]
            public string account { get; set; }
        }

        /// <summary> RPC请求:测试2 </summary>
        [MessagePackObject(true)]
        public class Test2Reply : IMessage
        {
            /// <summary> 错误码 </summary>
            [Key(0)]
            public Int64 code { get; set; }
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

        /// <summary> 测试4 </summary>
        [MessagePackObject(true)]
        public class Test4 : IMessage
        {
            /// <summary> test </summary>
            [Key(0)]
            public string test { get; set; }
        }

        #endregion

        #region Client 协议命令

        public enum ClientOpcode
        {
            /// <summary> 心跳 </summary>
            Ping = 0x100000,
            /// <summary> 测试1 </summary>
            Test1 = 0x100064,
            /// <summary> 测试2 </summary>
            Test2 = 0x100065,
        }

        #endregion

        #region System 协议命令

        public enum SystemOpcode
        {
            /// <summary> 测试3 </summary>
            Test3 = 0x1000064,
            /// <summary> 测试4 </summary>
            Test4 = 0x1000065,
        }

        #endregion

        #region BG 协议命令

        public enum BGOpcode
        {
        }

        #endregion

        #region 协议及结构    

        namespace Types
        {
            #region Client 协议结构

            /// <summary> 心跳 </summary>
            public class PingOper : Send<Ping, ClientOpcode>
            {
                public const ClientOpcode Opcode = ClientOpcode.Ping;
            }
            /// <summary> 测试1 </summary>
            public class Test1Oper : Send<Test1, ClientOpcode>
            {
                public const ClientOpcode Opcode = ClientOpcode.Test1;
            }
            /// <summary> RPC请求:测试2 </summary>
            public class Test2Oper : Call<Test2, Test2Reply, ClientOpcode>
            {
                public const ClientOpcode Opcode = ClientOpcode.Test2;
            }

            #endregion

            #region System 协议结构

            /// <summary> RPC请求:测试3 </summary>
            public class Test3Oper : Call<Test3, Test3Reply, SystemOpcode>
            {
                public const SystemOpcode Opcode = SystemOpcode.Test3;
            }
            /// <summary> 测试4 </summary>
            public class Test4Oper : Send<Test4, SystemOpcode>
            {
                public const SystemOpcode Opcode = SystemOpcode.Test4;
            }

            #endregion

            #region BG 协议结构


            #endregion

        }

        #endregion
    }
}
using MessagePack;
using System;
using System.Collections.Generic;
namespace Gen
{
    /// <summary> 数据库记录结构定义 </summary>
    namespace Access
    {
        #region 自定义结构

        /// <summary> 三维坐标 </summary>
        [MessagePackObject(true)]
        public class Vector3 : IAccess
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
        public class Test : IAccess
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
        }

        /// <summary> 账号 </summary>
        [MessagePackObject(true)]
        public class AccountInfo : IAccess
        {
            /// <summary> 帐号名 </summary>
            [Key(0)]
            public string account { get; set; }
            /// <summary> 创建时间 </summary>
            [Key(1)]
            public Int64 createTime { get; set; }
            /// <summary> 角色id </summary>
            [Key(2)]
            public Int64 uid { get; set; }
        }

        /// <summary> 角色自增id表 </summary>
        [MessagePackObject(true)]
        public class ActorIdRecord : IAccess
        {
            [Key(0)]
            public UInt64 objId { get; set; }
        }

        /// <summary> 测试 </summary>
        [MessagePackObject(true)]
        public class TestRecord : IAccess
        {
            /// <summary> 测试 </summary>
            [Key(0)]
            public Test test { get; set; }
        }

        /// <summary> Data </summary>
        [MessagePackObject(true)]
        public class DataRecord : IAccess
        {
            [Key(0)]
            public UInt64 objId { get; set; }
            [Key(1)]
            public Int64 a { get; set; }
            [Key(2)]
            public Int32 b { get; set; }
            [Key(3)]
            public UInt32 c { get; set; }
            /// <summary> 坐标信息 </summary>
            [Key(4)]
            public Vector3 pos { get; set; }
        }

        /// <summary> 帐号表 </summary>
        [MessagePackObject(true)]
        public class AccountRecord : IAccess
        {
            [Key(0)]
            public AccountInfo[] info { get; set; }
        }

        /// <summary> 测试 </summary>
        [MessagePackObject(true)]
        public class TestListRecord : IAccess
        {
            [Key(0)]
            public UInt64 objId { get; set; }
        }

        #endregion

        #region 数据库表名及表结构

        #region NativeKey


        public class NativeKeyNames
        {
        }

        #endregion

        #region NativeHash


        public class NativeHashNames
        {
        }

        #endregion

        #region NativeList


        public class NativeListNames
        {
        }

        #endregion

        #region Types
        namespace Types
        {
            #region Key
            #endregion

            #region Hash
            #endregion

            #region List
            #endregion

        }
        #endregion

        #region Key


        public class KeyNames
        {
            /// <summary> 角色自增id表 </summary>
            public const string ActorId = "ActorId";
        }

        #endregion

        #region Hash


        public class HashNames
        {
            /// <summary> 测试 </summary>
            public const string Test = "Test";
            /// <summary> Data </summary>
            public const string Data = "Data";
            /// <summary> 帐号表 </summary>
            public const string Account = "Account";
            /// <summary> 测试 </summary>
            public const string TestList = "TestList";
        }

        #endregion

        #region List


        public class ListNames
        {
        }

        #endregion

        #region Types
        namespace Types
        {
            #region Key
            public class ActorIdRecordOper : RecordOper<ActorIdRecord>
            {
                public override string Key { get; set; } = KeyNames.ActorId;
            }
            #endregion

            #region Hash
            public class TestRecordOper : RecordOper<TestRecord>
            {
                public override string Key { get; set; } = HashNames.Test;
            }
            public class DataRecordOper : RecordOper<DataRecord>
            {
                public override string Key { get; set; } = HashNames.Data;
            }
            public class AccountRecordOper : RecordOper<AccountRecord>
            {
                public override string Key { get; set; } = HashNames.Account;
            }
            public class TestListRecordOper : RecordOper<TestListRecord>
            {
                public override string Key { get; set; } = HashNames.TestList;
            }
            #endregion

            #region List
            #endregion

        }
        #endregion

        #endregion
    }
}
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

        /// <summary> 场景信息 </summary>
        [MessagePackObject(true)]
        public class SceneRecord : IAccess
        {
            /// <summary> 坐标信息 </summary>
            [Key(0)]
            public Vector3 pos { get; set; }
        }

        /// <summary> Data </summary>
        [MessagePackObject(true)]
        public class DataRecord : IAccess
        {
            /// <summary> 坐标信息 </summary>
            [Key(0)]
            public Vector3 pos { get; set; }
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

        #endregion

        #region 数据库表名及表结构

        #region NativeKey

        public class NativeKeyNames
        {
            /// <summary> 角色自增id表 </summary>
            public static string ActorId = "ActorId";
        }

        public class NativeKey
        {
            /// <summary> 角色自增id表 </summary>
            Int64 ActorId;
        }

        #endregion

        #region NativeHash

        public class NativeHashNames
        {
        }

        public class NativeHash
        {
        }

        #endregion

        #region NativeList

        public class NativeListNames
        {
        }

        public class NativeList
        {
        }

        #endregion

        #region Key

        public class KeyNames
        {
        }

        public class Key
        {
        }

        #endregion

        #region Hash

        public class HashNames
        {
            /// <summary> 场景信息 </summary>
            public static string Scene = "Scene";
            /// <summary> 帐号表 </summary>
            public static string Account = "Account";
        }

        public class Hash
        {
            /// <summary> 场景信息 </summary>
            SceneRecord Scene;
            /// <summary> 帐号表 </summary>
            AccountInfo[] Account;
        }

        #endregion

        #region List

        public class ListNames
        {
            /// <summary> Data </summary>
            public static string Data = "Data";
        }

        public class List
        {
            /// <summary> Data </summary>
            DataRecord Data;
        }

        #endregion

        #endregion
    }
}
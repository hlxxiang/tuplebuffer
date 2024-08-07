
using MessagePack;
using System.Collections.Generic;
/* 
+----------+-----------+-----------+
          .数据库记录结构定义.         
+----------+-----------+-----------+
 */
namespace Access 
{
    /// <summary>
    /// 三维坐标
    /// </summary>*/
    [MessagePackObject]
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

    /// <summary>
    /// 场景信息
    /// </summary>*/
    [MessagePackObject]
    public class SceneRecord : IAccess
    {
        /// <summary> 坐标信息 </summary>
        [Key(0)]
        public Vector3 pos { get; set; }
    }

    /// <summary>
    /// Data
    /// </summary>*/
    [MessagePackObject]
    public class DataRecord : IAccess
    {
        /// <summary> 坐标信息 </summary>
        [Key(0)]
        public Vector3 pos { get; set; }
    }

    /// <summary>
    /// 账号
    /// </summary>*/
    [MessagePackObject]
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
    public class NativeKeyNames {
        /// <summary> 角色自增id表 </summary>
        public static string ActorId = "ActorId";
    }

    public class NativeKey {
        /// <summary> 角色自增id表 </summary>
        Int64 ActorId;
    }

    public class NativeHashNames {
    }

    public class NativeHash {
    }

    public class NativeListNames {
    }

    public class NativeList {
    }

    public class KeyNames {
    }

    public class Key {
    }

    public class HashNames {
        /// <summary> 场景信息 </summary>
        public static string Scene = "Scene";
        /// <summary> 帐号表 </summary>
        public static string Account = "Account";
    }

    public class Hash {
        /// <summary> 场景信息 </summary>
        SceneRecord Scene;
        /// <summary> 帐号表 </summary>
        AccountInfo[] Account;
    }

    public class ListNames {
        /// <summary> Data </summary>
        public static string Data = "Data";
    }

    public class List {
        /// <summary> Data </summary>
        DataRecord Data;
    }


}
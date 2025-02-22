using MessagePack;
using System;
using System.Collections.Generic;
namespace Gen
{
    /// <summary> 配置 </summary>
    namespace Configuration
    {
#if SERVER
        #region 自定义结构

        /// <summary> 测试 </summary>
        [MessagePackObject(true)]
        public class Test : IConfiguration
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

        /// <summary> 属性 </summary>
        [MessagePackObject(true)]
        public class Attr : IConfiguration
        {
            /// <summary> 属性ID </summary>
            [Key(0)]
            public Int64 attrId { get; set; }
            /// <summary> 属性值 </summary>
            [Key(1)]
            public Int64 value { get; set; }
        }

        /// <summary> 三维坐标 </summary>
        [MessagePackObject(true)]
        public class Vector3 : IConfiguration
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

        [MessagePackObject(true)]
        public class Monster : IConfiguration
        {
            /// <summary> 怪物Id </summary>
            [Key(0)]
            public Int64 monsterId { get; set; }
            /// <summary> 怪物名 </summary>
            [Key(1)]
            public string name { get; set; }
            /// <summary> 怪物等级 </summary>
            [Key(2)]
            public Int64 level { get; set; }
            /// <summary> 属性 </summary>
            [Key(3)]
            public Attr[] attrs { get; set; }
            /// <summary> 技能列表 id#id </summary>
            [Key(4)]
            public Int64[] skills { get; set; }
            /// <summary> 坐标 </summary>
            [Key(5)]
            public Vector3 pos { get; set; }
        }

        #endregion

        #region 表名及表结构

        public class TypeNames
        {
            /// <summary> G-怪物配置 </summary>
            public static string monster = "monster";
        }

        public class Struct
        {
            /// <summary> G-怪物配置 </summary>
            public Dictionary<string, Monster> monster;
        };

        #endregion
#endif
    }
}
using MessagePack;
using System;
using System.Collections.Generic;
namespace Gen
{
    /*配置 */
    namespace Configuration
    {
        /// <summary>
        /// 测试
        /// </summary>*/
        [MessagePackObject(true)]
        public class Test : IConfiguration
        {
            /// <summary> id </summary>
            [Key(0)]
            public Int64 id { get; set; }
            /// <summary> 数值 </summary>
            [Key(1)]
            public Int64 num { get; set; }
            /// <summary> 字符串 </summary>
            [Key(2)]
            public string str { get; set; }
        }

        /// <summary>
        /// 属性
        /// </summary>*/
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

        /// <summary>
        /// 三维坐标
        /// </summary>*/
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
            /// <summary> 技能列表 id#id </summary>
            [Key(3)]
            public Int64[] skills { get; set; }
            /// <summary> 怪物模型 </summary>
            [Key(4)]
            public string model { get; set; }
            /// <summary> 坐标 </summary>
            [Key(5)]
            public Vector3 pos { get; set; }
            /// <summary> 头像 </summary>
            [Key(6)]
            public string head { get; set; }
        }

        public class TypeNames
        {
            /// <summary> G-怪物配置 </summary>
            public static string monster = "monster";
        }

        public class Struct
        {
            /// <summary> G-怪物配置 </summary>
            public Dictionary<string, Monster>? monster;

        };
    }
}
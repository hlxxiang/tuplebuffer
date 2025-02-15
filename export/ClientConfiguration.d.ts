declare namespace Gen {
    /*配置*/
    namespace Configuration {

        /** 测试 */
        const enum TestFields {
            /** id */
            num32 = 0,
            /** 数值 */
            uNum32 = 1,
            /** id */
            id64 = 2,
            /** 数值 */
            uId64 = 3,
            /** 字符串 */
            str = 4,
        }
        interface TestTypes {
            [TestFields.num32]: number;
            [TestFields.uNum32]: number;
            [TestFields.id64]: number;
            [TestFields.uId64]: number;
            [TestFields.str]: string;
        }
        /** 测试 */
        type Test = [number, number, number, number, string];

        /** 属性 */
        const enum AttrFields {
            /** 属性ID */
            attrId = 0,
            /** 属性值 */
            value = 1,
        }
        interface AttrTypes {
            [AttrFields.attrId]: number;
            [AttrFields.value]: number;
        }
        /** 属性 */
        type Attr = [number, number];

        /** 三维坐标 */
        const enum Vector3Fields {
            /** 坐标X */
            x = 0,
            /** 坐标Y */
            y = 1,
            /** 坐标Z */
            z = 2,
        }
        interface Vector3Types {
            [Vector3Fields.x]: number;
            [Vector3Fields.y]: number;
            [Vector3Fields.z]: number;
        }
        /** 三维坐标 */
        type Vector3 = [number, number, number];

        const enum MonsterFields {
            /** 怪物Id */
            monsterId = 0,
            /** 怪物名 */
            name = 1,
            /** 怪物等级 */
            level = 2,
            /** 技能列表 id#id */
            skills = 3,
            /** 怪物模型 */
            model = 4,
            /** 坐标 */
            pos = 5,
            /** 头像 */
            head = 6,
        }
        interface MonsterTypes {
            [MonsterFields.monsterId]: number;
            [MonsterFields.name]: string;
            [MonsterFields.level]: number;
            [MonsterFields.skills]: number[];
            [MonsterFields.model]: string;
            [MonsterFields.pos]: Vector3;
            [MonsterFields.head]: string;
        }
        type Monster = [number, string, number, number[], string, Vector3, string];

        const enum StructNames {
            /** G-怪物配置 */
            monster = "monster",
        }

        interface Struct {
            /** G-怪物配置 */
            "monster": Table<Monster>;
        }
    }
}
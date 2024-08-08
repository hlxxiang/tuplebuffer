declare namespace Gen {
    /* 数据库记录结构定义 */
    namespace Access {
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

        /** 场景信息 */
        const enum SceneRecordFields {
            /** 坐标信息 */
            pos = 0,
        }
        interface SceneRecordTypes {
            [SceneRecordFields.pos]: Vector3;
        }
        /** 场景信息 */
        type SceneRecord = [Vector3];

        /** Data */
        const enum DataRecordFields {
            /** 坐标信息 */
            pos = 0,
        }
        interface DataRecordTypes {
            [DataRecordFields.pos]: Vector3;
        }
        /** Data */
        type DataRecord = [Vector3];

        /** 账号 */
        const enum AccountInfoFields {
            /** 帐号名 */
            account = 0,
            /** 创建时间 */
            createTime = 1,
            /** 角色id */
            uid = 2,
        }
        interface AccountInfoTypes {
            [AccountInfoFields.account]: string;
            [AccountInfoFields.createTime]: number;
            [AccountInfoFields.uid]: number;
        }
        /** 账号 */
        type AccountInfo = [string, number, number];
        const enum NativeKeyNames {
            ActorId = "ActorId",
        }

        interface NativeKey {
            "ActorId": number,
        }

        const enum NativeHashNames {
        }

        interface NativeHash {
        }

        const enum NativeListNames {
        }

        interface NativeList {
        }

        const enum KeyNames {
        }

        interface Key {
        }

        const enum HashNames {
            Scene = "Scene",
            Account = "Account",
        }

        interface Hash {
            "Scene": SceneRecord,
            "Account": AccountInfo[],
        }

        const enum ListNames {
            Data = "Data",
        }

        interface List {
            "Data": DataRecord,
        }

    }
}
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

        /** 角色自增id表 */
        const enum ActorIdRecordFields {
            objId = 0,
        }
        interface ActorIdRecordTypes {
            [ActorIdRecordFields.objId]: number;
        }
        /** 角色自增id表 */
        type ActorIdRecord = [number];

        /** 测试 */
        const enum TestRecordFields {
            /** 测试 */
            test = 0,
        }
        interface TestRecordTypes {
            [TestRecordFields.test]: Test;
        }
        /** 测试 */
        type TestRecord = [Test];

        /** Data */
        const enum DataRecordFields {
            objId = 0,
            a = 1,
            b = 2,
            c = 3,
            /** 坐标信息 */
            pos = 4,
        }
        interface DataRecordTypes {
            [DataRecordFields.objId]: number;
            [DataRecordFields.a]: number;
            [DataRecordFields.b]: number;
            [DataRecordFields.c]: number;
            [DataRecordFields.pos]: Vector3;
        }
        /** Data */
        type DataRecord = [number, number, number, number, Vector3];

        /** 帐号表 */
        const enum AccountRecordFields {
            info = 0,
        }
        interface AccountRecordTypes {
            [AccountRecordFields.info]: AccountInfo[];
        }
        /** 帐号表 */
        type AccountRecord = [AccountInfo[]];

        /** 测试 */
        const enum TestListRecordFields {
            objId = 0,
        }
        interface TestListRecordTypes {
            [TestListRecordFields.objId]: number;
        }
        /** 测试 */
        type TestListRecord = [number];
        const enum NativeKeyNames {
        }

        interface NativeKey {
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
            ActorId = "ActorId",
        }

        interface Key {
            "ActorId": ActorIdRecord,
        }

        const enum HashNames {
            Test = "Test",
            Data = "Data",
            Account = "Account",
            TestList = "TestList",
        }

        interface Hash {
            "Test": TestRecord,
            "Data": DataRecord,
            "Account": AccountRecord,
            "TestList": TestListRecord,
        }

        const enum ListNames {
        }

        interface List {
        }

    }
}
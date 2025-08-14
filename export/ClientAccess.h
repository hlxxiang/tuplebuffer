#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

#include "IAccess.h"

namespace Gen
{
    /* 数据库记录结构定义 */
    namespace Access
    {
        using int32 = int32_t;
        using uint32 = uint32_t;
        using int64 = int64_t;
        using uint64 = uint64_t;
        using namespace std;
#ifdef CLIENT
        /* 三维坐标 */
        struct Vector3 : public IAccess
        {
            using Tuple = std::tuple<float, float, float>;
            /* 坐标X */
            float x;
            /* 坐标Y */
            float y;
            /* 坐标Z */
            float z;
        };
        std::shared_ptr<Vector3::Tuple> Vector3Encode(const std::shared_ptr<Vector3>& obj);
        std::shared_ptr<Vector3> Vector3Decode(const std::shared_ptr<Vector3::Tuple>& t);

        /* 测试 */
        struct Test : public IAccess
        {
            using Tuple = std::tuple<int32, uint32, int64, uint64, string>;
            /* id */
            int32 num32;
            /* 数值 */
            uint32 uNum32;
            /* id */
            int64 id64;
            /* 数值 */
            uint64 uId64;
            /* 字符串 */
            string str;
        };
        std::shared_ptr<Test::Tuple> TestEncode(const std::shared_ptr<Test>& obj);
        std::shared_ptr<Test> TestDecode(const std::shared_ptr<Test::Tuple>& t);

        /* 账号 */
        struct AccountInfo : public IAccess
        {
            using Tuple = std::tuple<string, int64, int64>;
            /* 帐号名 */
            string account;
            /* 创建时间 */
            int64 createTime;
            /* 角色id */
            int64 uid;
        };
        std::shared_ptr<AccountInfo::Tuple> AccountInfoEncode(const std::shared_ptr<AccountInfo>& obj);
        std::shared_ptr<AccountInfo> AccountInfoDecode(const std::shared_ptr<AccountInfo::Tuple>& t);

        /* 角色自增id表 */
        struct ActorIdRecord : public IAccess
        {
            using Tuple = std::tuple<uint64>;
            uint64 objId;
        };
        std::shared_ptr<ActorIdRecord::Tuple> ActorIdRecordEncode(const std::shared_ptr<ActorIdRecord>& obj);
        std::shared_ptr<ActorIdRecord> ActorIdRecordDecode(const std::shared_ptr<ActorIdRecord::Tuple>& t);

        /* 测试 */
        struct TestRecord : public IAccess
        {
            using Tuple = std::tuple<std::shared_ptr<Test::Tuple>>;
            /* 测试 */
            std::shared_ptr<Test> test;
        };
        std::shared_ptr<TestRecord::Tuple> TestRecordEncode(const std::shared_ptr<TestRecord>& obj);
        std::shared_ptr<TestRecord> TestRecordDecode(const std::shared_ptr<TestRecord::Tuple>& t);

        /* Data */
        struct DataRecord : public IAccess
        {
            using Tuple = std::tuple<uint64, int64, int32, uint32, std::shared_ptr<Vector3::Tuple>>;
            uint64 objId;
            int64 a;
            int32 b;
            uint32 c;
            /* 坐标信息 */
            std::shared_ptr<Vector3> pos;
        };
        std::shared_ptr<DataRecord::Tuple> DataRecordEncode(const std::shared_ptr<DataRecord>& obj);
        std::shared_ptr<DataRecord> DataRecordDecode(const std::shared_ptr<DataRecord::Tuple>& t);

        /* 帐号表 */
        struct AccountRecord : public IAccess
        {
            using Tuple = std::tuple<std::shared_ptr<std::vector<std::shared_ptr<AccountInfo::Tuple>>>>;
            std::shared_ptr<std::vector<std::shared_ptr<AccountInfo>>> info;
        };
        std::shared_ptr<AccountRecord::Tuple> AccountRecordEncode(const std::shared_ptr<AccountRecord>& obj);
        std::shared_ptr<AccountRecord> AccountRecordDecode(const std::shared_ptr<AccountRecord::Tuple>& t);

        /* 测试 */
        struct TestListRecord : public IAccess
        {
            using Tuple = std::tuple<uint64>;
            uint64 objId;
        };
        std::shared_ptr<TestListRecord::Tuple> TestListRecordEncode(const std::shared_ptr<TestListRecord>& obj);
        std::shared_ptr<TestListRecord> TestListRecordDecode(const std::shared_ptr<TestListRecord::Tuple>& t);

        namespace NativeKeyNames
        {
        }

        namespace NativeKey
        {
        };

        namespace NativeHashNames
        {
        }

        namespace NativeHash
        {
        };

        namespace NativeListNames
        {
        }

        namespace NativeList
        {
        };

        namespace KeyNames
        {
            /* 角色自增id表 */
            const string ActorId = "ActorId";
        }

        namespace Key
        {
            /* 角色自增id表 */
            using ActorId = std::shared_ptr<ActorIdRecord>;
        };

        namespace HashNames
        {
            /* 测试 */
            const string Test = "Test";
            /* Data */
            const string Data = "Data";
            /* 帐号表 */
            const string Account = "Account";
            /* 测试 */
            const string TestList = "TestList";
        }

        namespace Hash
        {
            /* 测试 */
            using Test = std::shared_ptr<TestRecord>;
            /* Data */
            using Data = std::shared_ptr<DataRecord>;
            /* 帐号表 */
            using Account = std::shared_ptr<AccountRecord>;
            /* 测试 */
            using TestList = std::shared_ptr<TestListRecord>;
        };

        namespace ListNames
        {
        }

        namespace List
        {
        };

#endif // CLIENT
    }
}
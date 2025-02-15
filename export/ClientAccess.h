#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

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
            using Tuple = std::tuple<std::optional<float>, std::optional<float>, std::optional<float>>;
            /* 坐标X */
            std::optional<float> x;
            /* 坐标Y */
            std::optional<float> y;
            /* 坐标Z */
            std::optional<float> z;
        };
        std::optional<Vector3::Tuple> Vector3Encode(std::optional<Vector3> &obj);
        std::optional<Vector3> Vector3Decode(std::optional<Vector3::Tuple> &t);

        /* 测试 */
        struct Test : public IAccess
        {
            using Tuple = std::tuple<std::optional<int32>, std::optional<uint32>, std::optional<int64>, std::optional<uint64>, std::optional<string>>;
            /* id */
            std::optional<int32> num32;
            /* 数值 */
            std::optional<uint32> uNum32;
            /* id */
            std::optional<int64> id64;
            /* 数值 */
            std::optional<uint64> uId64;
            /* 字符串 */
            std::optional<string> str;
        };
        std::optional<Test::Tuple> TestEncode(std::optional<Test> &obj);
        std::optional<Test> TestDecode(std::optional<Test::Tuple> &t);

        /* 账号 */
        struct AccountInfo : public IAccess
        {
            using Tuple = std::tuple<std::optional<string>, std::optional<int64>, std::optional<int64>>;
            /* 帐号名 */
            std::optional<string> account;
            /* 创建时间 */
            std::optional<int64> createTime;
            /* 角色id */
            std::optional<int64> uid;
        };
        std::optional<AccountInfo::Tuple> AccountInfoEncode(std::optional<AccountInfo> &obj);
        std::optional<AccountInfo> AccountInfoDecode(std::optional<AccountInfo::Tuple> &t);

        /* 角色自增id表 */
        struct ActorIdRecord : public IAccess
        {
            using Tuple = std::tuple<std::optional<uint64>>;
            std::optional<uint64> objId;
        };
        std::optional<ActorIdRecord::Tuple> ActorIdRecordEncode(std::optional<ActorIdRecord> &obj);
        std::optional<ActorIdRecord> ActorIdRecordDecode(std::optional<ActorIdRecord::Tuple> &t);

        /* 测试 */
        struct TestRecord : public IAccess
        {
            using Tuple = std::tuple<std::optional<Test::Tuple>>;
            /* 测试 */
            std::optional<Test> test;
        };
        std::optional<TestRecord::Tuple> TestRecordEncode(std::optional<TestRecord> &obj);
        std::optional<TestRecord> TestRecordDecode(std::optional<TestRecord::Tuple> &t);

        /* Data */
        struct DataRecord : public IAccess
        {
            using Tuple = std::tuple<std::optional<uint64>, std::optional<int64>, std::optional<int32>, std::optional<uint32>, std::optional<Vector3::Tuple>>;
            std::optional<uint64> objId;
            std::optional<int64> a;
            std::optional<int32> b;
            std::optional<uint32> c;
            /* 坐标信息 */
            std::optional<Vector3> pos;
        };
        std::optional<DataRecord::Tuple> DataRecordEncode(std::optional<DataRecord> &obj);
        std::optional<DataRecord> DataRecordDecode(std::optional<DataRecord::Tuple> &t);

        /* 帐号表 */
        struct AccountRecord : public IAccess
        {
            using Tuple = std::tuple<std::optional<std::vector<std::optional<AccountInfo::Tuple>>>>;
            std::optional<std::vector<std::optional<AccountInfo>>> info;
        };
        std::optional<AccountRecord::Tuple> AccountRecordEncode(std::optional<AccountRecord> &obj);
        std::optional<AccountRecord> AccountRecordDecode(std::optional<AccountRecord::Tuple> &t);

        /* 测试 */
        struct TestListRecord : public IAccess
        {
            using Tuple = std::tuple<std::optional<uint64>>;
            std::optional<uint64> objId;
        };
        std::optional<TestListRecord::Tuple> TestListRecordEncode(std::optional<TestListRecord> &obj);
        std::optional<TestListRecord> TestListRecordDecode(std::optional<TestListRecord::Tuple> &t);

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
            using ActorId = std::optional<ActorIdRecord>;
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
            using Test = std::optional<TestRecord>;
            /* Data */
            using Data = std::optional<DataRecord>;
            /* 帐号表 */
            using Account = std::optional<AccountRecord>;
            /* 测试 */
            using TestList = std::optional<TestListRecord>;
        };

        namespace ListNames
        {
        }

        namespace List
        {
        };

#endif // CLIENT    }
}
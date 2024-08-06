#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

/* 
+----------+-----------+-----------+
          .数据库记录结构定义.         
+----------+-----------+-----------+
 */
namespace Access 
{
    using int64 = int64_t;
    using int32 = int32_t;
    using namespace std;
    /* 三维坐标 */
    struct Vector3
    {
        using Tuple = std::tuple<std::optional<float>, std::optional<float>, std::optional<float>>;
        /* 坐标X */
        std::optional<float> x;
        /* 坐标Y */
        std::optional<float> y;
        /* 坐标Z */
        std::optional<float> z;
    };
    std::optional<Vector3::Tuple> Vector3Encode(std::optional<Vector3>& obj);
    std::optional<Vector3> Vector3Decode(std::optional<Vector3::Tuple>& t);

    /* 场景信息 */
    struct SceneRecord
    {
        using Tuple = std::tuple<std::optional<Vector3::Tuple>>;
        /* 坐标信息 */
        std::optional<Vector3> pos;
    };
    std::optional<SceneRecord::Tuple> SceneRecordEncode(std::optional<SceneRecord>& obj);
    std::optional<SceneRecord> SceneRecordDecode(std::optional<SceneRecord::Tuple>& t);

    /* Data */
    struct DataRecord
    {
        using Tuple = std::tuple<std::optional<Vector3::Tuple>>;
        /* 坐标信息 */
        std::optional<Vector3> pos;
    };
    std::optional<DataRecord::Tuple> DataRecordEncode(std::optional<DataRecord>& obj);
    std::optional<DataRecord> DataRecordDecode(std::optional<DataRecord::Tuple>& t);

    /* 账号 */
    struct AccountInfo
    {
        using Tuple = std::tuple<std::optional<string>, std::optional<int64>, std::optional<int64>>;
        /* 帐号名 */
        std::optional<string> account;
        /* 创建时间 */
        std::optional<int64> createTime;
        /* 角色id */
        std::optional<int64> uid;
    };
    std::optional<AccountInfo::Tuple> AccountInfoEncode(std::optional<AccountInfo>& obj);
    std::optional<AccountInfo> AccountInfoDecode(std::optional<AccountInfo::Tuple>& t);


    namespace NativeKeyNames
    {
        /* 角色自增id表 */
        const string ActorId = "ActorId";
    }

    namespace NativeKey
    {
        /* 角色自增id表 */
        using ActorId = std::optional<int64>;
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
    }

    namespace Key
    {
    };

    namespace HashNames
    {
        /* 场景信息 */
        const string Scene = "Scene";
        /* 帐号表 */
        const string Account = "Account";
    }

    namespace Hash
    {
        /* 场景信息 */
        using Scene = std::optional<SceneRecord>;
        /* 帐号表 */
        using Account = std::optional<std::vector<std::optional<AccountInfo>>>;
    };

    namespace ListNames
    {
        /* Data */
        const string Data = "Data";
    }

    namespace List
    {
        /* Data */
        using Data = std::optional<DataRecord>;
    };
}
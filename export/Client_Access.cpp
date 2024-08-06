
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

#include "Client_Access.h"

/* 
+----------+-----------+-----------+
          .数据库记录结构定义.         
+----------+-----------+-----------+
 */
namespace Access 
{
    using namespace std;
    std::optional<Vector3::Tuple> Vector3Encode(std::optional<Vector3>& obj)
    {
        if (obj.has_value()) {
            auto& oValue = obj.value();
            return Vector3::Tuple(oValue.x, oValue.y, oValue.z);
        }
        else {
            return std::nullopt;
        }
    }
    std::optional<Vector3> Vector3Decode(std::optional<Vector3::Tuple>& t)
    {
        std::optional<Vector3> obj;
        if (t.has_value())
        {
            obj = Vector3();
            auto& oValue = obj.value();
            auto& tValue = t.value();
            oValue.x = std::get<0>(tValue);
            oValue.y = std::get<1>(tValue);
            oValue.z = std::get<2>(tValue);
        }
        return obj;
    }

    std::optional<SceneRecord::Tuple> SceneRecordEncode(std::optional<SceneRecord>& obj)
    {
        if (obj.has_value()) {
            auto& oValue = obj.value();
            return SceneRecord::Tuple(Vector3Encode(oValue.pos));
        }
        else {
            return std::nullopt;
        }
    }
    std::optional<SceneRecord> SceneRecordDecode(std::optional<SceneRecord::Tuple>& t)
    {
        std::optional<SceneRecord> obj;
        if (t.has_value())
        {
            obj = SceneRecord();
            auto& oValue = obj.value();
            auto& tValue = t.value();
            oValue.pos = Vector3Decode(std::get<0>(tValue));
        }
        return obj;
    }

    std::optional<DataRecord::Tuple> DataRecordEncode(std::optional<DataRecord>& obj)
    {
        if (obj.has_value()) {
            auto& oValue = obj.value();
            return DataRecord::Tuple(Vector3Encode(oValue.pos));
        }
        else {
            return std::nullopt;
        }
    }
    std::optional<DataRecord> DataRecordDecode(std::optional<DataRecord::Tuple>& t)
    {
        std::optional<DataRecord> obj;
        if (t.has_value())
        {
            obj = DataRecord();
            auto& oValue = obj.value();
            auto& tValue = t.value();
            oValue.pos = Vector3Decode(std::get<0>(tValue));
        }
        return obj;
    }

    std::optional<AccountInfo::Tuple> AccountInfoEncode(std::optional<AccountInfo>& obj)
    {
        if (obj.has_value()) {
            auto& oValue = obj.value();
            return AccountInfo::Tuple(oValue.account, oValue.createTime, oValue.uid);
        }
        else {
            return std::nullopt;
        }
    }
    std::optional<AccountInfo> AccountInfoDecode(std::optional<AccountInfo::Tuple>& t)
    {
        std::optional<AccountInfo> obj;
        if (t.has_value())
        {
            obj = AccountInfo();
            auto& oValue = obj.value();
            auto& tValue = t.value();
            oValue.account = std::get<0>(tValue);
            oValue.createTime = std::get<1>(tValue);
            oValue.uid = std::get<2>(tValue);
        }
        return obj;
    }

}
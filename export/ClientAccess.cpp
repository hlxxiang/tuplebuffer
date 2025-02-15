
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

#include "ClientAccess.h"

namespace Gen
{
    /* 数据库记录结构定义 */
    namespace Access
    {
        using namespace std;
#ifdef CLIENT
        std::optional<Vector3::Tuple> Vector3Encode(std::optional<Vector3> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return Vector3::Tuple(oValue.x, oValue.y, oValue.z);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Vector3> Vector3Decode(std::optional<Vector3::Tuple> &t)
        {
            std::optional<Vector3> obj;
            if (t.has_value())
            {
                obj = Vector3();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.x = std::get<0>(tValue);
                oValue.y = std::get<1>(tValue);
                oValue.z = std::get<2>(tValue);
            }
            return obj;
        }

        std::optional<Test::Tuple> TestEncode(std::optional<Test> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return Test::Tuple(oValue.num32, oValue.uNum32, oValue.id64, oValue.uId64, oValue.str);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Test> TestDecode(std::optional<Test::Tuple> &t)
        {
            std::optional<Test> obj;
            if (t.has_value())
            {
                obj = Test();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.num32 = std::get<0>(tValue);
                oValue.uNum32 = std::get<1>(tValue);
                oValue.id64 = std::get<2>(tValue);
                oValue.uId64 = std::get<3>(tValue);
                oValue.str = std::get<4>(tValue);
            }
            return obj;
        }

        std::optional<AccountInfo::Tuple> AccountInfoEncode(std::optional<AccountInfo> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return AccountInfo::Tuple(oValue.account, oValue.createTime, oValue.uid);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<AccountInfo> AccountInfoDecode(std::optional<AccountInfo::Tuple> &t)
        {
            std::optional<AccountInfo> obj;
            if (t.has_value())
            {
                obj = AccountInfo();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.account = std::get<0>(tValue);
                oValue.createTime = std::get<1>(tValue);
                oValue.uid = std::get<2>(tValue);
            }
            return obj;
        }

        std::optional<ActorIdRecord::Tuple> ActorIdRecordEncode(std::optional<ActorIdRecord> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return ActorIdRecord::Tuple(oValue.objId);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<ActorIdRecord> ActorIdRecordDecode(std::optional<ActorIdRecord::Tuple> &t)
        {
            std::optional<ActorIdRecord> obj;
            if (t.has_value())
            {
                obj = ActorIdRecord();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.objId = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<TestRecord::Tuple> TestRecordEncode(std::optional<TestRecord> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return TestRecord::Tuple(TestEncode(oValue.test));
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<TestRecord> TestRecordDecode(std::optional<TestRecord::Tuple> &t)
        {
            std::optional<TestRecord> obj;
            if (t.has_value())
            {
                obj = TestRecord();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.test = TestDecode(std::get<0>(tValue));
            }
            return obj;
        }

        std::optional<DataRecord::Tuple> DataRecordEncode(std::optional<DataRecord> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return DataRecord::Tuple(oValue.objId, oValue.a, oValue.b, oValue.c, Vector3Encode(oValue.pos));
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<DataRecord> DataRecordDecode(std::optional<DataRecord::Tuple> &t)
        {
            std::optional<DataRecord> obj;
            if (t.has_value())
            {
                obj = DataRecord();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.objId = std::get<0>(tValue);
                oValue.a = std::get<1>(tValue);
                oValue.b = std::get<2>(tValue);
                oValue.c = std::get<3>(tValue);
                oValue.pos = Vector3Decode(std::get<4>(tValue));
            }
            return obj;
        }

        std::optional<AccountRecord::Tuple> AccountRecordEncode(std::optional<AccountRecord> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                std::optional<std::vector<std::optional<AccountInfo::Tuple>>> infoArr;
                if (oValue.info.has_value())
                {
                    infoArr = std::vector<std::optional<AccountInfo::Tuple>>();
                    auto &value = infoArr.value();
                    auto &info = oValue.info.value();
                    for (auto i = 0; i < info.size(); ++i)
                    {
                        value.push_back(AccountInfoEncode(info[i]));
                    }
                }
                return AccountRecord::Tuple(infoArr);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<AccountRecord> AccountRecordDecode(std::optional<AccountRecord::Tuple> &t)
        {
            std::optional<AccountRecord> obj;
            if (t.has_value())
            {
                obj = AccountRecord();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                auto &info_t = std::get<0>(tValue);
                if (info_t.has_value())
                {
                    oValue.info = std::vector<std::optional<AccountInfo>>();
                    auto &info = info_t.value();
                    auto &value = oValue.info.value();
                    for (auto i = 0; i < info.size(); ++i)
                    {
                        value.push_back(AccountInfoDecode(info[i]));
                    }
                }
            }
            return obj;
        }

        std::optional<TestListRecord::Tuple> TestListRecordEncode(std::optional<TestListRecord> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return TestListRecord::Tuple(oValue.objId);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<TestListRecord> TestListRecordDecode(std::optional<TestListRecord::Tuple> &t)
        {
            std::optional<TestListRecord> obj;
            if (t.has_value())
            {
                obj = TestListRecord();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.objId = std::get<0>(tValue);
            }
            return obj;
        }

#endif // CLIENT    }
}

#include <tuple>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

#include "IAccess.h"

#include "ClientAccess.h"

namespace Gen
{
    /* 数据库记录结构定义 */
    namespace Access
    {
        using namespace std;
#ifdef CLIENT
        std::shared_ptr<Vector3::Tuple> Vector3Encode(const std::shared_ptr<Vector3>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<Vector3::Tuple>(obj->x, obj->y, obj->z);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Vector3> Vector3Decode(const std::shared_ptr<Vector3::Tuple>& t)
        {
            std::shared_ptr<Vector3> obj;
            if (t != nullptr)
            {
                obj = make_shared<Vector3>();
                obj->x = std::get<0>(*t.get());
                obj->y = std::get<1>(*t.get());
                obj->z = std::get<2>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<Test::Tuple> TestEncode(const std::shared_ptr<Test>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<Test::Tuple>(obj->num32, obj->uNum32, obj->id64, obj->uId64, obj->str);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Test> TestDecode(const std::shared_ptr<Test::Tuple>& t)
        {
            std::shared_ptr<Test> obj;
            if (t != nullptr)
            {
                obj = make_shared<Test>();
                obj->num32 = std::get<0>(*t.get());
                obj->uNum32 = std::get<1>(*t.get());
                obj->id64 = std::get<2>(*t.get());
                obj->uId64 = std::get<3>(*t.get());
                obj->str = std::get<4>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<AccountInfo::Tuple> AccountInfoEncode(const std::shared_ptr<AccountInfo>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<AccountInfo::Tuple>(obj->account, obj->createTime, obj->uid);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<AccountInfo> AccountInfoDecode(const std::shared_ptr<AccountInfo::Tuple>& t)
        {
            std::shared_ptr<AccountInfo> obj;
            if (t != nullptr)
            {
                obj = make_shared<AccountInfo>();
                obj->account = std::get<0>(*t.get());
                obj->createTime = std::get<1>(*t.get());
                obj->uid = std::get<2>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<ActorIdRecord::Tuple> ActorIdRecordEncode(const std::shared_ptr<ActorIdRecord>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<ActorIdRecord::Tuple>(obj->objId);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<ActorIdRecord> ActorIdRecordDecode(const std::shared_ptr<ActorIdRecord::Tuple>& t)
        {
            std::shared_ptr<ActorIdRecord> obj;
            if (t != nullptr)
            {
                obj = make_shared<ActorIdRecord>();
                obj->objId = std::get<0>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<TestRecord::Tuple> TestRecordEncode(const std::shared_ptr<TestRecord>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<TestRecord::Tuple>(TestEncode(obj->test));
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<TestRecord> TestRecordDecode(const std::shared_ptr<TestRecord::Tuple>& t)
        {
            std::shared_ptr<TestRecord> obj;
            if (t != nullptr)
            {
                obj = make_shared<TestRecord>();
                obj->test = TestDecode(std::get<0>(*t.get()));
            }
            return obj;
        }

        std::shared_ptr<DataRecord::Tuple> DataRecordEncode(const std::shared_ptr<DataRecord>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<DataRecord::Tuple>(obj->objId, obj->a, obj->b, obj->c, Vector3Encode(obj->pos));
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<DataRecord> DataRecordDecode(const std::shared_ptr<DataRecord::Tuple>& t)
        {
            std::shared_ptr<DataRecord> obj;
            if (t != nullptr)
            {
                obj = make_shared<DataRecord>();
                obj->objId = std::get<0>(*t.get());
                obj->a = std::get<1>(*t.get());
                obj->b = std::get<2>(*t.get());
                obj->c = std::get<3>(*t.get());
                obj->pos = Vector3Decode(std::get<4>(*t.get()));
            }
            return obj;
        }

        std::shared_ptr<AccountRecord::Tuple> AccountRecordEncode(const std::shared_ptr<AccountRecord>& obj)
        {
            if (obj != nullptr)
            {
                std::shared_ptr<std::vector<std::shared_ptr<AccountInfo::Tuple>>> infoArr;
                if (obj->info != nullptr)
                {
                    infoArr = make_shared<std::vector<std::shared_ptr<AccountInfo::Tuple>>>();
                    auto& value = *infoArr.get();
                    auto& info = *obj->info.get();
                    for (auto i = 0; i < info.size(); ++i)
                    {
                        value.push_back(AccountInfoEncode(info[i]));
                    }
                }
                return make_shared<AccountRecord::Tuple>(infoArr);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<AccountRecord> AccountRecordDecode(const std::shared_ptr<AccountRecord::Tuple>& t)
        {
            std::shared_ptr<AccountRecord> obj;
            if (t != nullptr)
            {
                obj = make_shared<AccountRecord>();
                auto& info_t = std::get<0>(*t.get());
                if (info_t != nullptr)
                {
                    obj->info = make_shared<std::vector<std::shared_ptr<AccountInfo>>>();
                    auto& info = *info_t.get();
                    auto& value = *obj->info.get();
                    for (auto i = 0; i < info.size(); ++i)
                    {
                        value.push_back(AccountInfoDecode(info[i]));
                    }
                }
            }
            return obj;
        }

        std::shared_ptr<TestListRecord::Tuple> TestListRecordEncode(const std::shared_ptr<TestListRecord>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<TestListRecord::Tuple>(obj->objId);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<TestListRecord> TestListRecordDecode(const std::shared_ptr<TestListRecord::Tuple>& t)
        {
            std::shared_ptr<TestListRecord> obj;
            if (t != nullptr)
            {
                obj = make_shared<TestListRecord>();
                obj->objId = std::get<0>(*t.get());
            }
            return obj;
        }

#endif // CLIENT
    }
}
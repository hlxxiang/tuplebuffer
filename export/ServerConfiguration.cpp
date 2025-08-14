
#include <tuple>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

#include "IConfiguration.h"

#include "ServerConfiguration.h"

namespace Gen
{
    /* 配置 */
    namespace Configuration
    {
        using namespace std;
#ifdef SERVER
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

        std::shared_ptr<Attr::Tuple> AttrEncode(const std::shared_ptr<Attr>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<Attr::Tuple>(obj->attrId, obj->value);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Attr> AttrDecode(const std::shared_ptr<Attr::Tuple>& t)
        {
            std::shared_ptr<Attr> obj;
            if (t != nullptr)
            {
                obj = make_shared<Attr>();
                obj->attrId = std::get<0>(*t.get());
                obj->value = std::get<1>(*t.get());
            }
            return obj;
        }

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

        std::shared_ptr<Monster::Tuple> MonsterEncode(const std::shared_ptr<Monster>& obj)
        {
            if (obj != nullptr)
            {
                std::shared_ptr<std::vector<std::shared_ptr<Attr::Tuple>>> attrsArr;
                if (obj->attrs != nullptr)
                {
                    attrsArr = make_shared<std::vector<std::shared_ptr<Attr::Tuple>>>();
                    auto& value = *attrsArr.get();
                    auto& attrs = *obj->attrs.get();
                    for (auto i = 0; i < attrs.size(); ++i)
                    {
                        value.push_back(AttrEncode(attrs[i]));
                    }
                }
                std::shared_ptr<std::vector<int64>> skillsArr;
                if (obj->skills != nullptr)
                {
                    skillsArr = make_shared<std::vector<int64>>();
                    auto& value = *skillsArr.get();
                    auto& skills = *obj->skills.get();
                    for (auto i = 0; i < skills.size(); ++i)
                    {
                        value.push_back(skills[i]);
                    }
                }
                return make_shared<Monster::Tuple>(obj->monsterId, obj->name, obj->level, attrsArr, skillsArr, Vector3Encode(obj->pos));
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Monster> MonsterDecode(const std::shared_ptr<Monster::Tuple>& t)
        {
            std::shared_ptr<Monster> obj;
            if (t != nullptr)
            {
                obj = make_shared<Monster>();
                auto& attrs_t = std::get<3>(*t.get());
                if (attrs_t != nullptr)
                {
                    obj->attrs = make_shared<std::vector<std::shared_ptr<Attr>>>();
                    auto& attrs = *attrs_t.get();
                    auto& value = *obj->attrs.get();
                    for (auto i = 0; i < attrs.size(); ++i)
                    {
                        value.push_back(AttrDecode(attrs[i]));
                    }
                }
                auto& skills_t = std::get<4>(*t.get());
                if (skills_t != nullptr)
                {
                    obj->skills = make_shared<std::vector<int64>>();
                    auto& skills = *skills_t.get();
                    auto& value = *obj->skills.get();
                    for (auto i = 0; i < skills.size(); ++i)
                    {
                        value.push_back(skills[i]);
                    }
                }
                obj->monsterId = std::get<0>(*t.get());
                obj->name = std::get<1>(*t.get());
                obj->level = std::get<2>(*t.get());
                obj->pos = Vector3Decode(std::get<5>(*t.get()));
            }
            return obj;
        }

#endif // SERVER
    }
}
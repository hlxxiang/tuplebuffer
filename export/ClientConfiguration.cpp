
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

#include "ClientConfiguration.h"

namespace Gen
{
    /* 配置 */
    namespace Configuration
    {
        using namespace std;
#ifdef CLIENT
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

        std::optional<Attr::Tuple> AttrEncode(std::optional<Attr> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return Attr::Tuple(oValue.attrId, oValue.value);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Attr> AttrDecode(std::optional<Attr::Tuple> &t)
        {
            std::optional<Attr> obj;
            if (t.has_value())
            {
                obj = Attr();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.attrId = std::get<0>(tValue);
                oValue.value = std::get<1>(tValue);
            }
            return obj;
        }

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

        std::optional<Monster::Tuple> MonsterEncode(std::optional<Monster> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                std::optional<std::vector<std::optional<int64>>> skillsArr;
                if (oValue.skills.has_value())
                {
                    skillsArr = std::vector<std::optional<int64>>();
                    auto &value = skillsArr.value();
                    auto &skills = oValue.skills.value();
                    for (auto i = 0; i < skills.size(); ++i)
                    {
                        value.push_back(skills[i]);
                    }
                }
                return Monster::Tuple(oValue.monsterId, oValue.name, oValue.level, skillsArr, oValue.model, Vector3Encode(oValue.pos), oValue.head);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Monster> MonsterDecode(std::optional<Monster::Tuple> &t)
        {
            std::optional<Monster> obj;
            if (t.has_value())
            {
                obj = Monster();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                auto &skills_t = std::get<3>(tValue);
                if (skills_t.has_value())
                {
                    oValue.skills = std::vector<std::optional<int64>>();
                    auto &skills = skills_t.value();
                    auto &value = oValue.skills.value();
                    for (auto i = 0; i < skills.size(); ++i)
                    {
                        value.push_back(skills[i]);
                    }
                }
                oValue.monsterId = std::get<0>(tValue);
                oValue.name = std::get<1>(tValue);
                oValue.level = std::get<2>(tValue);
                oValue.model = std::get<4>(tValue);
                oValue.pos = Vector3Decode(std::get<5>(tValue));
                oValue.head = std::get<6>(tValue);
            }
            return obj;
        }

#endif // CLIENT    }
}
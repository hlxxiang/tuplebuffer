#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

#include "IConfiguration.h"

namespace Gen
{
    /* 配置 */
    namespace Configuration
    {
        using int32 = int32_t;
        using uint32 = uint32_t;
        using int64 = int64_t;
        using uint64 = uint64_t;
        using namespace std;
#ifdef CLIENT
        /* 测试 */
        struct Test : public IConfiguration
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

        /* 属性 */
        struct Attr : public IConfiguration
        {
            using Tuple = std::tuple<int64, int64>;
            /* 属性ID */
            int64 attrId;
            /* 属性值 */
            int64 value;
        };
        std::shared_ptr<Attr::Tuple> AttrEncode(const std::shared_ptr<Attr>& obj);
        std::shared_ptr<Attr> AttrDecode(const std::shared_ptr<Attr::Tuple>& t);

        /* 三维坐标 */
        struct Vector3 : public IConfiguration
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

        struct Monster : public IConfiguration
        {
            using Tuple = std::tuple<int64, string, int64, std::shared_ptr<std::vector<int64>>, string, std::shared_ptr<Vector3::Tuple>, string>;
            /* 怪物Id */
            int64 monsterId;
            /* 怪物名 */
            string name;
            /* 怪物等级 */
            int64 level;
            /* 技能列表 id#id */
            std::shared_ptr<std::vector<int64>> skills;
            /* 怪物模型 */
            string model;
            /* 坐标 */
            std::shared_ptr<Vector3> pos;
            /* 头像 */
            string head;
        };
        std::shared_ptr<Monster::Tuple> MonsterEncode(const std::shared_ptr<Monster>& obj);
        std::shared_ptr<Monster> MonsterDecode(const std::shared_ptr<Monster::Tuple>& t);

        namespace TypeNames
        {
            /* G-怪物配置 */
            const string monster = "monster";
        };

        namespace Struct
        {
            /* G-怪物配置 */
            using monster = std::unordered_map<string, Monster>;
        };

#endif // CLIENT
    }
}
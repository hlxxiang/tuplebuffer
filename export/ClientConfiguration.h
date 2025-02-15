#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

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

        /* 属性 */
        struct Attr : public IConfiguration
        {
            using Tuple = std::tuple<std::optional<int64>, std::optional<int64>>;
            /* 属性ID */
            std::optional<int64> attrId;
            /* 属性值 */
            std::optional<int64> value;
        };
        std::optional<Attr::Tuple> AttrEncode(std::optional<Attr> &obj);
        std::optional<Attr> AttrDecode(std::optional<Attr::Tuple> &t);

        /* 三维坐标 */
        struct Vector3 : public IConfiguration
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

        struct Monster : public IConfiguration
        {
            using Tuple = std::tuple<std::optional<int64>, std::optional<string>, std::optional<int64>, std::optional<std::vector<std::optional<int64>>>, std::optional<string>, std::optional<Vector3::Tuple>, std::optional<string>>;
            /* 怪物Id */
            std::optional<int64> monsterId;
            /* 怪物名 */
            std::optional<string> name;
            /* 怪物等级 */
            std::optional<int64> level;
            /* 技能列表 id#id */
            std::optional<std::vector<std::optional<int64>>> skills;
            /* 怪物模型 */
            std::optional<string> model;
            /* 坐标 */
            std::optional<Vector3> pos;
            /* 头像 */
            std::optional<string> head;
        };
        std::optional<Monster::Tuple> MonsterEncode(std::optional<Monster> &obj);
        std::optional<Monster> MonsterDecode(std::optional<Monster::Tuple> &t);

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

#endif // CLIENT    }
}
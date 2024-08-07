#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

/* 配置 */
namespace Configuration 
{
    using int64 = int64_t;
    using int32 = int32_t;
    using namespace std;
    /* 测试 */
    struct Test : public IConfiguration
    {
        using Tuple = std::tuple<std::optional<int64>, std::optional<int64>, std::optional<string>>;
        /* id */
        std::optional<int64> id;
        /* 数值 */
        std::optional<int64> num;
        /* 字符串 */
        std::optional<string> str;
    };
    std::optional<Test::Tuple> TestEncode(std::optional<Test>& obj);
    std::optional<Test> TestDecode(std::optional<Test::Tuple>& t);

    /* 属性 */
    struct Attr : public IConfiguration
    {
        using Tuple = std::tuple<std::optional<int64>, std::optional<int64>>;
        /* 属性ID */
        std::optional<int64> attrId;
        /* 属性值 */
        std::optional<int64> value;
    };
    std::optional<Attr::Tuple> AttrEncode(std::optional<Attr>& obj);
    std::optional<Attr> AttrDecode(std::optional<Attr::Tuple>& t);

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
    std::optional<Vector3::Tuple> Vector3Encode(std::optional<Vector3>& obj);
    std::optional<Vector3> Vector3Decode(std::optional<Vector3::Tuple>& t);

    struct Monster : public IConfiguration
    {
        using Tuple = std::tuple<std::optional<int64>, std::optional<string>, std::optional<int64>, std::optional<std::vector<std::optional<Attr::Tuple>>>, std::optional<std::vector<std::optional<int64>>>, std::optional<Vector3::Tuple>>;
        /* 怪物Id */
        std::optional<int64> monsterId;
        /* 怪物名 */
        std::optional<string> name;
        /* 怪物等级 */
        std::optional<int64> level;
        /* 属性 */
        std::optional<std::vector<std::optional<Attr>>> attrs;
        /* 技能列表 id#id */
        std::optional<std::vector<std::optional<int64>>> skills;
        /* 坐标 */
        std::optional<Vector3> pos;
    };
    std::optional<Monster::Tuple> MonsterEncode(std::optional<Monster>& obj);
    std::optional<Monster> MonsterDecode(std::optional<Monster::Tuple>& t);

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

}

#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

#include "Protocols.h"

namespace Gen
{
    /* 协议 */
    namespace Protocols
    {
        using namespace std;
        std::optional<Test1::Tuple> Test1Encode(std::optional<Test1>& obj)
        {
            if (obj.has_value()) {
                auto& oValue = obj.value();
                return Test1::Tuple(oValue.test);
            }
            else {
                return std::nullopt;
            }
        }
        std::optional<Test1> Test1Decode(std::optional<Test1::Tuple>& t)
        {
            std::optional<Test1> obj;
            if (t.has_value())
            {
                obj = Test1();
                auto& oValue = obj.value();
                auto& tValue = t.value();
                oValue.test = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test2::Tuple> Test2Encode(std::optional<Test2>& obj)
        {
            if (obj.has_value()) {
                auto& oValue = obj.value();
                return Test2::Tuple(oValue.account);
            }
            else {
                return std::nullopt;
            }
        }
        std::optional<Test2> Test2Decode(std::optional<Test2::Tuple>& t)
        {
            std::optional<Test2> obj;
            if (t.has_value())
            {
                obj = Test2();
                auto& oValue = obj.value();
                auto& tValue = t.value();
                oValue.account = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test2Reply::Tuple> Test2ReplyEncode(std::optional<Test2Reply>& obj)
        {
            if (obj.has_value()) {
                auto& oValue = obj.value();
                return Test2Reply::Tuple(oValue.code);
            }
            else {
                return std::nullopt;
            }
        }
        std::optional<Test2Reply> Test2ReplyDecode(std::optional<Test2Reply::Tuple>& t)
        {
            std::optional<Test2Reply> obj;
            if (t.has_value())
            {
                obj = Test2Reply();
                auto& oValue = obj.value();
                auto& tValue = t.value();
                oValue.code = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test3::Tuple> Test3Encode(std::optional<Test3>& obj)
        {
            if (obj.has_value()) {
                auto& oValue = obj.value();
                return Test3::Tuple(oValue.account);
            }
            else {
                return std::nullopt;
            }
        }
        std::optional<Test3> Test3Decode(std::optional<Test3::Tuple>& t)
        {
            std::optional<Test3> obj;
            if (t.has_value())
            {
                obj = Test3();
                auto& oValue = obj.value();
                auto& tValue = t.value();
                oValue.account = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test3Reply::Tuple> Test3ReplyEncode(std::optional<Test3Reply>& obj)
        {
            if (obj.has_value()) {
                auto& oValue = obj.value();
                return Test3Reply::Tuple(oValue.code);
            }
            else {
                return std::nullopt;
            }
        }
        std::optional<Test3Reply> Test3ReplyDecode(std::optional<Test3Reply::Tuple>& t)
        {
            std::optional<Test3Reply> obj;
            if (t.has_value())
            {
                obj = Test3Reply();
                auto& oValue = obj.value();
                auto& tValue = t.value();
                oValue.code = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test4::Tuple> Test4Encode(std::optional<Test4>& obj)
        {
            if (obj.has_value()) {
                auto& oValue = obj.value();
                return Test4::Tuple(oValue.test);
            }
            else {
                return std::nullopt;
            }
        }
        std::optional<Test4> Test4Decode(std::optional<Test4::Tuple>& t)
        {
            std::optional<Test4> obj;
            if (t.has_value())
            {
                obj = Test4();
                auto& oValue = obj.value();
                auto& tValue = t.value();
                oValue.test = std::get<0>(tValue);
            }
            return obj;
        }
    }
}
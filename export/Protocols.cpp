
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

        std::optional<Ping::Tuple> PingEncode(std::optional<Ping> &obj)
        {
            return std::nullopt;
        }
        std::optional<Ping> PingDecode(std::optional<Ping::Tuple> &t)
        {
            return std::nullopt;
        }

        std::optional<Pong::Tuple> PongEncode(std::optional<Pong> &obj)
        {
            return std::nullopt;
        }
        std::optional<Pong> PongDecode(std::optional<Pong::Tuple> &t)
        {
            return std::nullopt;
        }

        std::optional<Test3::Tuple> Test3Encode(std::optional<Test3> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return Test3::Tuple(oValue.account);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Test3> Test3Decode(std::optional<Test3::Tuple> &t)
        {
            std::optional<Test3> obj;
            if (t.has_value())
            {
                obj = Test3();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.account = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test3Reply::Tuple> Test3ReplyEncode(std::optional<Test3Reply> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return Test3Reply::Tuple(oValue.code);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Test3Reply> Test3ReplyDecode(std::optional<Test3Reply::Tuple> &t)
        {
            std::optional<Test3Reply> obj;
            if (t.has_value())
            {
                obj = Test3Reply();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.code = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<Test1::Tuple> Test1Encode(std::optional<Test1> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return Test1::Tuple(oValue.test);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<Test1> Test1Decode(std::optional<Test1::Tuple> &t)
        {
            std::optional<Test1> obj;
            if (t.has_value())
            {
                obj = Test1();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.test = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<AuthClient::Tuple> AuthClientEncode(std::optional<AuthClient> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return AuthClient::Tuple(oValue.account);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<AuthClient> AuthClientDecode(std::optional<AuthClient::Tuple> &t)
        {
            std::optional<AuthClient> obj;
            if (t.has_value())
            {
                obj = AuthClient();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.account = std::get<0>(tValue);
            }
            return obj;
        }

        std::optional<AuthClientReply::Tuple> AuthClientReplyEncode(std::optional<AuthClientReply> &obj)
        {
            if (obj.has_value())
            {

                auto &oValue = obj.value();
                return AuthClientReply::Tuple(oValue.code);
            }
            else
            {
                return std::nullopt;
            }
        }
        std::optional<AuthClientReply> AuthClientReplyDecode(std::optional<AuthClientReply::Tuple> &t)
        {
            std::optional<AuthClientReply> obj;
            if (t.has_value())
            {
                obj = AuthClientReply();
                auto &oValue = obj.value();
                auto &tValue = t.value();
                oValue.code = std::get<0>(tValue);
            }
            return obj;
        }
    }
}
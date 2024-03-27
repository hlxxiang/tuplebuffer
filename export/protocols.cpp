
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

#include "protocols.h"

/* 协议 */
namespace Protocols 
{
    using namespace std;
    std::optional<AuthClient::Tuple> AuthClientEncode(std::optional<AuthClient>& obj)
    {
        if (obj.has_value()) {
            auto& oValue = obj.value();
            return AuthClient::Tuple(oValue.account);
        }
        else {
            return std::nullopt;
        }
    }
    std::optional<AuthClient> AuthClientDecode(std::optional<AuthClient::Tuple>& t)
    {
        std::optional<AuthClient> obj;
        if (t.has_value())
        {
            obj = AuthClient();
            auto& oValue = obj.value();
            auto& tValue = t.value();
            oValue.account = std::get<0>(tValue);
        }
        return obj;
    }

    std::optional<AuthClientReply::Tuple> AuthClientReplyEncode(std::optional<AuthClientReply>& obj)
    {
        if (obj.has_value()) {
            auto& oValue = obj.value();
            return AuthClientReply::Tuple(oValue.code);
        }
        else {
            return std::nullopt;
        }
    }
    std::optional<AuthClientReply> AuthClientReplyDecode(std::optional<AuthClientReply::Tuple>& t)
    {
        std::optional<AuthClientReply> obj;
        if (t.has_value())
        {
            obj = AuthClientReply();
            auto& oValue = obj.value();
            auto& tValue = t.value();
            oValue.code = std::get<0>(tValue);
        }
        return obj;
    }

    std::optional<Ping::Tuple> PingEncode(std::optional<Ping>& obj)
    {
        return std::nullopt;
    }
    std::optional<Ping> PingDecode(std::optional<Ping::Tuple>& t)
    {
        return std::nullopt;
    }

}
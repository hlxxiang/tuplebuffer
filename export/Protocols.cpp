
#include <tuple>
#include <string>
#include <vector>
#include <memory>
#include <optional>
#include <unordered_map>

#include "IProtocols.h"

#include "Protocols.h"

namespace Gen
{
    /* 协议 */
    namespace Protocols
    {
        using namespace std;

        std::shared_ptr<Ping::Tuple> PingEncode(const std::shared_ptr<Ping>& obj)
        {
            return nullptr;
        }
        std::shared_ptr<Ping> PingDecode(const std::shared_ptr<Ping::Tuple>& t)
        {
            return nullptr;
        }

        std::shared_ptr<Pong::Tuple> PongEncode(const std::shared_ptr<Pong>& obj)
        {
            return nullptr;
        }
        std::shared_ptr<Pong> PongDecode(const std::shared_ptr<Pong::Tuple>& t)
        {
            return nullptr;
        }

        std::shared_ptr<Test3::Tuple> Test3Encode(const std::shared_ptr<Test3>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<Test3::Tuple>(obj->account);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Test3> Test3Decode(const std::shared_ptr<Test3::Tuple>& t)
        {
            std::shared_ptr<Test3> obj;
            if (t != nullptr)
            {
                obj = make_shared<Test3>();
                obj->account = std::get<0>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<Test3Reply::Tuple> Test3ReplyEncode(const std::shared_ptr<Test3Reply>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<Test3Reply::Tuple>(obj->code);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Test3Reply> Test3ReplyDecode(const std::shared_ptr<Test3Reply::Tuple>& t)
        {
            std::shared_ptr<Test3Reply> obj;
            if (t != nullptr)
            {
                obj = make_shared<Test3Reply>();
                obj->code = std::get<0>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<Test1::Tuple> Test1Encode(const std::shared_ptr<Test1>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<Test1::Tuple>(obj->test);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<Test1> Test1Decode(const std::shared_ptr<Test1::Tuple>& t)
        {
            std::shared_ptr<Test1> obj;
            if (t != nullptr)
            {
                obj = make_shared<Test1>();
                obj->test = std::get<0>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<AuthClient::Tuple> AuthClientEncode(const std::shared_ptr<AuthClient>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<AuthClient::Tuple>(obj->account);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<AuthClient> AuthClientDecode(const std::shared_ptr<AuthClient::Tuple>& t)
        {
            std::shared_ptr<AuthClient> obj;
            if (t != nullptr)
            {
                obj = make_shared<AuthClient>();
                obj->account = std::get<0>(*t.get());
            }
            return obj;
        }

        std::shared_ptr<AuthClientReply::Tuple> AuthClientReplyEncode(const std::shared_ptr<AuthClientReply>& obj)
        {
            if (obj != nullptr)
            {
                return make_shared<AuthClientReply::Tuple>(obj->code);
            }
            else
            {
                return nullptr;
            }
        }
        std::shared_ptr<AuthClientReply> AuthClientReplyDecode(const std::shared_ptr<AuthClientReply::Tuple>& t)
        {
            std::shared_ptr<AuthClientReply> obj;
            if (t != nullptr)
            {
                obj = make_shared<AuthClientReply>();
                obj->code = std::get<0>(*t.get());
            }
            return obj;
        }

    }
}
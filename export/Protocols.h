#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <memory>
#include <optional>
#include <unordered_map>

#include "IProtocols.h"

namespace Gen
{
    /* 协议 */
    namespace Protocols
    {
        using int32 = int32_t;
        using uint32 = uint32_t;
        using int64 = int64_t;
        using uint64 = uint64_t;
        using namespace std;

        enum class MsgFields
        {
            /* 请求 */
            Request = 0x0,
            /* 回应 */
            Reply = 0x1,
        };

        enum class ProtocolMask
        {
            /* 高字节位 SourceGroup 类型 */
            SourceGroupMask = 0x7000000,
            /* 中字节 TargetGroup 类型 */
            TargetGroupMask = 0xf00000,
        };

        enum class BitMask
        {
            /* SourceGroup 类型 */
            SourceGroup = 0x18,
            /* TargetGroup 类型 */
            TargetGroup = 0x14,
        };

        enum class GroupType
        {
            /* Group 类型: Client */
            Client = 0x0,
            /* Group 类型: System */
            System = 0x1,
            /* Group 类型: BG */
            BG = 0x2,
        };

        enum class ServerType
        {
            /* Client:客户端 */
            Client = 0x0,
            /* Gateway:网关 */
            Gateway = 0x1,
            /* End */
            End = 0x14,
        };

        /* 心跳 */
        struct Ping : public IMessage
        {
            using Tuple = std::tuple<std::nullopt_t>;
        };
        std::shared_ptr<Ping::Tuple> PingEncode(const std::shared_ptr<Ping>& obj);
        std::shared_ptr<Ping> PingDecode(const std::shared_ptr<Ping::Tuple>& t);

        /* 心跳 */
        struct Pong : public IMessage
        {
            using Tuple = std::tuple<std::nullopt_t>;
        };
        std::shared_ptr<Pong::Tuple> PongEncode(const std::shared_ptr<Pong>& obj);
        std::shared_ptr<Pong> PongDecode(const std::shared_ptr<Pong::Tuple>& t);

        /* 测试3 */
        struct Test3 : public IMessage
        {
            using Tuple = std::tuple<string>;
            /* 账号 */
            string account;
        };
        std::shared_ptr<Test3::Tuple> Test3Encode(const std::shared_ptr<Test3>& obj);
        std::shared_ptr<Test3> Test3Decode(const std::shared_ptr<Test3::Tuple>& t);

        /* RPC请求:测试3 */
        struct Test3Reply : public IMessage
        {
            using Tuple = std::tuple<int64>;
            /* 错误码 */
            int64 code;
        };
        std::shared_ptr<Test3Reply::Tuple> Test3ReplyEncode(const std::shared_ptr<Test3Reply>& obj);
        std::shared_ptr<Test3Reply> Test3ReplyDecode(const std::shared_ptr<Test3Reply::Tuple>& t);

        /* 测试1 */
        struct Test1 : public IMessage
        {
            using Tuple = std::tuple<string>;
            string test;
        };
        std::shared_ptr<Test1::Tuple> Test1Encode(const std::shared_ptr<Test1>& obj);
        std::shared_ptr<Test1> Test1Decode(const std::shared_ptr<Test1::Tuple>& t);

        /* 客户端验证 */
        struct AuthClient : public IMessage
        {
            using Tuple = std::tuple<string>;
            /* 账号 */
            string account;
        };
        std::shared_ptr<AuthClient::Tuple> AuthClientEncode(const std::shared_ptr<AuthClient>& obj);
        std::shared_ptr<AuthClient> AuthClientDecode(const std::shared_ptr<AuthClient::Tuple>& t);

        /* RPC请求:客户端验证 */
        struct AuthClientReply : public IMessage
        {
            using Tuple = std::tuple<int64>;
            /* 错误码 */
            int64 code;
        };
        std::shared_ptr<AuthClientReply::Tuple> AuthClientReplyEncode(const std::shared_ptr<AuthClientReply>& obj);
        std::shared_ptr<AuthClientReply> AuthClientReplyDecode(const std::shared_ptr<AuthClientReply::Tuple>& t);

        /* C to S 协议命令 */
        enum class C2SOpcode
        {
            /* 心跳 */
            Ping = 0x100000,
            /* 测试3 */
            Test3 = 0x100001,
            /* 测试1 */
            Test1 = 0x100064,
            /* 客户端验证 */
            AuthClient = 0x100065,
        };

        /* S to C 协议命令 */
        enum class S2COpcode
        {
            /* 心跳 */
            Pong = 0x1000000,
        };
        /* C to S  协议 */
        namespace C2SProtocols
        {
            /* 心跳 */
            class PingOper : public Send<Ping, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode::Ping;
            };
            /* RPC请求:测试3 */
            class Test3Oper : public Call<Test3, Test3Reply, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode::Test3;
            };
            /* 测试1 */
            class Test1Oper : public Send<Test1, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode::Test1;
            };
            /* RPC请求:客户端验证 */
            class AuthClientOper : public Call<AuthClient, AuthClientReply, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode::AuthClient;
            };
        }

        /* S to C 协议 */
        namespace S2CProtocols
        {
            /* 心跳 */
            class PongOper : public Send<Pong, S2COpcode>
            {
            public:
                static constexpr S2COpcode Opcode = S2COpcode::Pong;
            };
        }


    }
}
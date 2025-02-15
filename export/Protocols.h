#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

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
            SourceGroupMask = 0x700000,
            /* 中字节 TargetGroup 类型 */
            TargetGroupMask = 0xf000000,
        };

        enum class BitMask
        {
            /* SourceGroup 类型 */
            SourceGroup = 0x14,
            /* TargetGroup 类型 */
            TargetGroup = 0x18,
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
        std::optional<Ping::Tuple> PingEncode(std::optional<Ping> &obj);
        std::optional<Ping> PingDecode(std::optional<Ping::Tuple> &t);

        /* 心跳 */
        struct Pong : public IMessage
        {
            using Tuple = std::tuple<std::nullopt_t>;
        };
        std::optional<Pong::Tuple> PongEncode(std::optional<Pong> &obj);
        std::optional<Pong> PongDecode(std::optional<Pong::Tuple> &t);

        /* 测试3 */
        struct Test3 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            /* 账号 */
            std::optional<string> account;
        };
        std::optional<Test3::Tuple> Test3Encode(std::optional<Test3> &obj);
        std::optional<Test3> Test3Decode(std::optional<Test3::Tuple> &t);

        /* RPC请求:测试3 */
        struct Test3Reply : public IMessage
        {
            using Tuple = std::tuple<std::optional<int64>>;
            /* 错误码 */
            std::optional<int64> code;
        };
        std::optional<Test3Reply::Tuple> Test3ReplyEncode(std::optional<Test3Reply> &obj);
        std::optional<Test3Reply> Test3ReplyDecode(std::optional<Test3Reply::Tuple> &t);

        /* 测试1 */
        struct Test1 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            std::optional<string> test;
        };
        std::optional<Test1::Tuple> Test1Encode(std::optional<Test1> &obj);
        std::optional<Test1> Test1Decode(std::optional<Test1::Tuple> &t);

        /* 测试2 */
        struct Test2 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            /* 账号 */
            std::optional<string> account;
        };
        std::optional<Test2::Tuple> Test2Encode(std::optional<Test2> &obj);
        std::optional<Test2> Test2Decode(std::optional<Test2::Tuple> &t);

        /* RPC请求:测试2 */
        struct Test2Reply : public IMessage
        {
            using Tuple = std::tuple<std::optional<int64>>;
            /* 错误码 */
            std::optional<int64> code;
        };
        std::optional<Test2Reply::Tuple> Test2ReplyEncode(std::optional<Test2Reply> &obj);
        std::optional<Test2Reply> Test2ReplyDecode(std::optional<Test2Reply::Tuple> &t);

        /* C to S 协议命令 */
        enum class C2SOpcode
        {
        }

        /* S to C 协议命令 */
        enum class S2COpcode
        {
            /* 心跳 */
            Pong = 0x100000,
        }
        /* C to S  协议 */
        namespace C2SProtocols
        {
            /* 心跳 */
            class PingOper : Send<Ping, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode.Ping;
            }
            /* RPC请求:测试3 */
            class Test3Oper : Call<Test3, Test3Reply, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode.Test3;
            }
            /* 测试1 */
            class Test1Oper : Send<Test1, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode.Test1;
            }
            /* RPC请求:测试2 */
            class Test2Oper : Call<Test2, Test2Reply, C2SOpcode>
            {
            public:
                static constexpr C2SOpcode Opcode = C2SOpcode.Test2;
            }
        }

        /* S to C 协议 */
        namespace S2CProtocols
        {
            /* 心跳 */
            class PongOper : Send<Pong, S2COpcode>
            {
            public:
                static constexpr S2COpcode Opcode = S2COpcode.Pong;
            }
        }

    }
}
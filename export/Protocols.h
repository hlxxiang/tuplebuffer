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
            /* 高字节位 Group 类型 */
            GroupMask = 0x7000000,
            /* 中字节 Service 类型 */
            ServiceMask = 0xf00000,
        };
        enum class BitMask
        {
            /* Service 类型 */
            ServiceType = 0x14,
        };
        enum class GroupType
        {
            /* Group 类型: Client */
            Client = 0x0,
            /* Group 类型: System */
            System = 0x1000000,
            /* Group 类型: BG */
            BG = 0x2000000,
        };
        enum class ServiceType
        {
            /* Service 类型: Client */
            Client = 0x0,
            /* Service 类型: Gateway */
            Gateway = 0x100000,
            /* End */
            End = 0x1400000,
        };
        /* 心跳 */
        struct Ping : public IMessage
        {
            using Tuple = std::tuple<std::nullopt_t>;
        };
        std::optional<Ping::Tuple> PingEncode(std::optional<Ping>& obj);
        std::optional<Ping> PingDecode(std::optional<Ping::Tuple>& t);

        /* 测试1 */
        struct Test1 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            std::optional<string> test;
        };
        std::optional<Test1::Tuple> Test1Encode(std::optional<Test1>& obj);
        std::optional<Test1> Test1Decode(std::optional<Test1::Tuple>& t);

        /* 测试2 */
        struct Test2 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            /* 账号 */
            std::optional<string> account;
        };
        std::optional<Test2::Tuple> Test2Encode(std::optional<Test2>& obj);
        std::optional<Test2> Test2Decode(std::optional<Test2::Tuple>& t);

        /* RPC请求:测试2 */
        struct Test2Reply : public IMessage
        {
            using Tuple = std::tuple<std::optional<int64>>;
            /* 错误码 */
            std::optional<int64> code;
        };
        std::optional<Test2Reply::Tuple> Test2ReplyEncode(std::optional<Test2Reply>& obj);
        std::optional<Test2Reply> Test2ReplyDecode(std::optional<Test2Reply::Tuple>& t);

        /* 测试3 */
        struct Test3 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            /* 账号 */
            std::optional<string> account;
        };
        std::optional<Test3::Tuple> Test3Encode(std::optional<Test3>& obj);
        std::optional<Test3> Test3Decode(std::optional<Test3::Tuple>& t);

        /* RPC请求:测试3 */
        struct Test3Reply : public IMessage
        {
            using Tuple = std::tuple<std::optional<int64>>;
            /* 错误码 */
            std::optional<int64> code;
        };
        std::optional<Test3Reply::Tuple> Test3ReplyEncode(std::optional<Test3Reply>& obj);
        std::optional<Test3Reply> Test3ReplyDecode(std::optional<Test3Reply::Tuple>& t);

        /* 测试4 */
        struct Test4 : public IMessage
        {
            using Tuple = std::tuple<std::optional<string>>;
            /* test */
            std::optional<string> test;
        };
        std::optional<Test4::Tuple> Test4Encode(std::optional<Test4>& obj);
        std::optional<Test4> Test4Decode(std::optional<Test4::Tuple>& t);

        /* Client 协议命令 */
        enum class ClientOpcode
        {
            /* 心跳 */
            Ping = 0x100000,
            /* 测试1 */
            Test1 = 0x100064,
            /* 测试2 */
            Test2 = 0x100065,
        };

        /* System 协议命令 */
        enum class SystemOpcode
        {
            /* 测试3 */
            Test3 = 0x1000064,
            /* 测试4 */
            Test4 = 0x1000065,
        };

        /* BG 协议命令 */
        enum class BGOpcode
        {
        };


        /* 协议及结构 */
        namespace Types
        {
            /* Client 协议结构 */
            /* 心跳 */
            using Ping = std::tuple<Ping>;
            /* 测试1 */
            using Test1 = std::tuple<Test1>;
            /* RPC请求:测试2 */
            using Test2 = std::tuple<Test2, Test2Reply>;
            /* Client 协议结构 */

            /* System 协议结构 */
            /* RPC请求:测试3 */
            using Test3 = std::tuple<Test3, Test3Reply>;
            /* 测试4 */
            using Test4 = std::tuple<Test4>;
            /* System 协议结构 */

            /* BG 协议结构 */
            /* BG 协议结构 */
        }
    }
}
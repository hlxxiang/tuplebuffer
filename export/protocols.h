#pragma once
#include <tuple>
#include <string>
#include <vector>
#include <optional>
#include <unordered_map>

/* 协议 */
namespace Protocols 
{
    using int64 = int64_t;
    using int32 = int32_t;
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
    /* 客户端验证 */
    struct AuthClient
    {
        using Tuple = std::tuple<std::optional<string>>;
        /* 账号 */
        std::optional<string> account;
    };
    std::optional<AuthClient::Tuple> AuthClientEncode(std::optional<AuthClient>& obj);
    std::optional<AuthClient> AuthClientDecode(std::optional<AuthClient::Tuple>& t);

    /* RPC返回:客户端验证 */
    struct AuthClientReply
    {
        using Tuple = std::tuple<std::optional<int64>>;
        /* 错误码 */
        std::optional<int64> code;
    };
    std::optional<AuthClientReply::Tuple> AuthClientReplyEncode(std::optional<AuthClientReply>& obj);
    std::optional<AuthClientReply> AuthClientReplyDecode(std::optional<AuthClientReply::Tuple>& t);

    /* 客户端心跳 */
    struct Ping
    {
        using Tuple = std::tuple<std::nullopt_t>;
    };
    std::optional<Ping::Tuple> PingEncode(std::optional<Ping>& obj);
    std::optional<Ping> PingDecode(std::optional<Ping::Tuple>& t);

    /* Client命令 */
    enum class ClientOpcode
    {
        /* 客户端验证 */
        AuthClient = 0x100000,
        /* 客户端心跳 */
        Ping = 0x100001,
    };

    /* System命令 */
    enum class SystemOpcode
    {
    };

    /* BG命令 */
    enum class BGOpcode
    {
    };


    /*    命令类型    */
    namespace Types
    {
        /* Client命令 */
        /* RPC返回:客户端验证 */
        using AuthClient = std::tuple<AuthClient, AuthClientReply>;
        /* 客户端心跳 */
        using Ping = std::tuple<Ping>;
        /* System命令 */
        /* BG命令 */
    }
}
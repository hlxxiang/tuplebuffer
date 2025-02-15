#pragma once

namespace Gen
{
    // 定义嵌套命名空间 Protocols
    namespace Protocols
    {
        /** 协议接口 */
        class IProtocols
        {
        public:
            virtual ~IProtocols() = default;
        };

        /** 协议结构 */
        class IMessage
        {
        public:
            virtual ~IMessage() = default;
        };

        /** 普通请求协议类继承自它 */
        class ISend : public IProtocols
        {
        public:
            virtual IMessage *&Request() = 0;
            virtual ~ISend() = default;
        };

        /** RPC 协议接口 */
        class ICall : public IProtocols
        {
        public:
            virtual IMessage *&Request() = 0;
            virtual IMessage *&Reply() = 0;
            virtual ~ICall() = default;
        };

        /** 普通协议，生成的普通协议继承自它 */
        template <typename T1, typename OP>
        class Send : public ISend
        {
        public:
            T1 *request = nullptr;

            IMessage *&Request() override
            {
                return reinterpret_cast<IMessage *&>(request);
            }
        };

        /** RPC 协议，生成的 RPC 协议继承自它 */
        template <typename T1, typename T2, typename OP>
        class Call : public ICall
        {
        public:
            T1 *request = nullptr;
            T2 *reply = nullptr;

            IMessage *&Request() override
            {
                return reinterpret_cast<IMessage *&>(request);
            }

            IMessage *&Reply() override
            {
                return reinterpret_cast<IMessage *&>(reply);
            }
        };
    }
}
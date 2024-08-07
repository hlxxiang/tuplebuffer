namespace Protocols
{
    /// <summary> 协议接口 </summary>  
    public interface IProtocols
    {
    }

    public interface IMessage
    {
    }

    public interface ISend : IProtocols
    {
        IMessage Request { get; set; }
    }

    public interface ICall : IProtocols
    {
        IMessage Request { get; set; }
        IMessage Reply { get; set; }
    }

    /// <summary> 普通协议 </summary>  
    /// <typeparam name="T1">请求类型</typeparam>  
    /// <typeparam name="OP">协议号</typeparam>  
    public class Send<T1, OP> : ISend
        where T1 : IMessage
    {
        public T1 Request { get; set; }
        IMessage ISend.Request
        {
            get => Request;
            set => Request = (T1)value;
        }
    }

    /// <summary> RPC 协议 </summary>  
    /// <typeparam name="T1">请求类型</typeparam>  
    /// <typeparam name="T2">回应类型</typeparam>  
    /// <typeparam name="OP">协议号</typeparam>  
    public class Call<T1, T2, OP> : ICall
        where T1 : IMessage
        where T2 : IMessage
    {
        public T1 Request { get; set; }
        public T2 Reply { get; set; }
        IMessage ICall.Request
        {
            get => Request;
            set => Request = (T1)value;
        }
        IMessage ICall.Reply
        {
            get => Reply;
            set => Reply = (T2)value;
        }
    }
}
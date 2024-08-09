namespace Gen
{
    namespace Access
    {
        /// <summary> 
        /// 自定义接口
        /// 生成的数据库结构继承自它
        /// </summary>
        public interface IAccess
        {
        }

        public interface IRecordOper
        {

        }

        public class RecordOper<T> : IRecordOper
            where T : IAccess
        {
            public virtual string Key { get; set; }
        }
    }
}
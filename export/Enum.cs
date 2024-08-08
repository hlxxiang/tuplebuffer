namespace Gen
{
    /// <summary> 枚举 </summary>
    namespace Enum
    {
        /// <summary> 枚举A </summary>
        public enum TestA
        {
            /// <summary> TestA.a </summary>
            a = 1,
            /// <summary> TestA.b </summary>
            b = 2,
        }

        /// <summary> Enum B </summary>
        public enum TestB
        {
            /// <summary> TestB.a </summary>
            a = TestA.b,
            /// <summary> TestB.b </summary>
            b = 3,
        }

    }
}
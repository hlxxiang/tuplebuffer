namespace Gen {
    /* 枚举 */

    namespace Enum
    {
        /// <summary>
        /// TestA
        /// </summary>
        public enum TestA
        {
            /// <summary> TestA.a </summary>
            a = 1,
            /// <summary> TestA.b </summary>
            b = 2,
        }

        /// <summary>
        /// TestB
        /// </summary>
        public enum TestB
        {
            /// <summary> TestB.a </summary>
            a = TestA.b,
            /// <summary> TestB.b </summary>
            b = 3,
        }

    }
}
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

        /// <summary> Specifies the day of the week. </summary>
        public enum DayOfWeek
        {
            /// <summary>  </summary>
            Sunday = 0,
            /// <summary>  </summary>
            Monday = 1,
            /// <summary>  </summary>
            Tuesday = 2,
            /// <summary>  </summary>
            Wednesday = 3,
            /// <summary>  </summary>
            Thursday = 4,
            /// <summary>  </summary>
            Friday = 5,
            /// <summary>  </summary>
            Saturday = 6,
        }

    }
}
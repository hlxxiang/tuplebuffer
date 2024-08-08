#pragma once
namespace Gen
{
    /* 枚举 */
    namespace Enum
    {
        /* 枚举A */
        enum class TestA
        {
            /* TestA.a */
            a = 1,
            /* TestA.b */
            b = 2,
        };

        /* Enum B */
        enum class TestB
        {
            /* TestB.a */
            a = (int)(TestA::b),
            /* TestB.b */
            b = 3,
        };

    }
}
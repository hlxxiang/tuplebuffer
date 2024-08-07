#pragma once
namespace Gen
{
    /* 枚举 */
    namespace Enum
    {
        /* TestA */
        enum class TestA
        {
            /* TestA.a */
            a = 1,
            /* TestA.b */
            b = 2,
        };

        /* TestB */
        enum class TestB
        {
            /* TestB.a */
            a = (int)(TestA::b),
            /* TestB.b */
            b = 3,
        };

    }
}
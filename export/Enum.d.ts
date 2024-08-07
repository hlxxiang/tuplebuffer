/*枚举*/
declare namespace Gen {
    namespace Enum {

        /** TestA */
        const enum TestA {
            /** TestA.a */
            a = 1,
            /** TestA.b */
            b = 2,
        }

        /** TestB */
        const enum TestB {
            /** TestB.a */
            a = TestA.b,
            /** TestB.b */
            b = 3,
        }

    }
}
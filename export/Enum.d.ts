declare namespace Gen {
    /*枚举*/
    namespace Enum {

        /** 枚举A */
        const enum TestA {
            /** TestA.a */
            a = 1,
            /** TestA.b */
            b = 2,
        }

        /** Enum B */
        const enum TestB {
            /** TestB.a */
            a = TestA.b,
            /** TestB.b */
            b = 3,
        }

    }
}
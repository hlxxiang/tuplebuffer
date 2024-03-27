"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../../compiler/enum");
(0, enum_1.enums)("TestA", [
    (0, enum_1.enumItem)("a", "TestA.a", 1),
    (0, enum_1.enumItem)("b", "TestA.b"),
], "TestA");
(0, enum_1.enums)("TestB", [
    (0, enum_1.enumItem)("a", "TestB.a", 111, "TestA.b"),
    (0, enum_1.enumItem)("b", "TestB.b"),
], "TestB");
//# sourceMappingURL=enum_util.js.map
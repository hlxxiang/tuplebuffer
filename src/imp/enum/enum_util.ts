import { enumItem, enums } from "../../compiler/enum"

enums("TestA", [
    enumItem("a", "TestA.a", 1),
    enumItem("b", "TestA.b"),
], "TestA")

enums("TestB", [
    enumItem("a", "TestB.a", 111, "TestA.b"),
    enumItem("b", "TestB.b"),
], "TestB")
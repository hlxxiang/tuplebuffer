import { enumItem, enums } from "../../compiler/enum"

enums("TestA", [
    enumItem("a", "TestA.a", 1),
    enumItem("b", "TestA.b"),
], "枚举A")

enums("TestB", [
    enumItem("a", "TestB.a", 111, "TestA.b"),
    enumItem("b", "TestB.b"),
], "Enum B")

enums("DayOfWeek", [
    enumItem("Sunday", "", 0),
    enumItem("Monday", "", 1),
    enumItem("Tuesday", "", 2),
    enumItem("Wednesday", "", 3),
    enumItem("Thursday", "", 4),
    enumItem("Friday", "", 5),
    enumItem("Saturday", "", 6),
], "Specifies the day of the week.")
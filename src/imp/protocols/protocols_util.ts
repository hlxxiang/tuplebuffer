import { float, int32, int64, string, tuple, uint32, uint64 } from "../../compiler/compile";

export namespace Util {
    export const Vector3 = tuple("Vector3", [
        float("x", "坐标X"),
        float("y", "坐标Y"),
        float("z", "坐标Z"),
    ], "三维坐标");

    export const Test = tuple("Test", [
        int32("num32", "id"),
        uint32("uNum32", "数值"),
        int64("id64", "id"),
        uint64("uId64", "数值"),
        string("str", "字符串"),
    ], "测试");
}
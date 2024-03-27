import { array, boolean, float, int64, string, tuple } from "../../compiler/compile";

export namespace Util {
    export const Test = tuple("Test", [
        int64("id", "id"),
        int64("num", "数值"),
        string("str", "字符串"),
    ], "测试");
    
    export const Attr = tuple("Attr", [
        int64("attrId", "属性ID"),
        int64("value", "属性值"),
    ], "属性");

    export const Vector3 = tuple("Vector3", [
        float("x", "坐标X"),
        float("y", "坐标Y"),
        float("z", "坐标Z"),
    ], "三维坐标");
}
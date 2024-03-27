import { float, tuple } from "../../compiler/compile";

export namespace Util {
    export const Vector3 = tuple("Vector3", [
        float("x", "坐标X"),
        float("y", "坐标Y"),
        float("z", "坐标Z"),
    ], "三维坐标");
}
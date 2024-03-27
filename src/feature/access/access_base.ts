import { TupleBase } from "../base/tuple_base";

export interface AccessBase extends TupleBase {
    precompile(declaration: string): void;
    compileGroupTypes(prefix: string, group: RecordMeta[][], channelDefine: [number, string][]): void;
}
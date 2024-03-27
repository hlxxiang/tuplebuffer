import { TupleBase } from "../base/tuple_base";

export interface ProtocolsBase extends TupleBase {
    init(maxOpcode: number, channelLimit: number, commandSuffix: string): void;
    precompile(declaration: string): void;
    compileEnum(name: string, elements: [number, string, string][]): void;
    compileGroups(groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void;
    compileTypes(typesName: string, groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void;
}
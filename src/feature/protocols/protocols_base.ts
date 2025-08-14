import { TupleBase } from "../base/tuple_base";

export const GroupOpcodeNames: string[] = []
GroupOpcodeNames[GroupType.Client] = "C";
GroupOpcodeNames[GroupType.System] = "S";
GroupOpcodeNames[GroupType.BG] = "BG";

export interface ProtocolsBase extends TupleBase {
    init(maxOpcode: number, channelLimit: number, commandSuffix: string): void;
    precompile(declaration: string): void;
    compileEnum(name: string, elements: [number, string, string][]): void;
    compileGroups(groups: Map<GroupType, ProtocolGroup>, groupDefines: [number, string, string][]): void;
    compileTypes(name: string, groups: Map<GroupType, ProtocolGroup>, groupDefines: [number, string, string][]): void;
}
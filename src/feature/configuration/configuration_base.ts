import { TupleBase } from "../base/tuple_base";


export interface ConfigurationBase extends TupleBase {
    precompile(declaration: string): void;
    compileTypeNames(files: FileMeta[], exportType: ExportType): void;
    compileTypes(files: FileMeta[], exportType: ExportType): void;
    compileStruct(files: FileMeta[], exportType: ExportType): void;
}
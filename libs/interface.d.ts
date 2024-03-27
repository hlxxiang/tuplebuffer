declare interface Table<T> {
    [key: string]: T;
}

declare interface TypeMeta {
    /** 数据类型 */
    metaType: MetaType;
    /** 类名 */
    className: string;
}

declare interface VarMeta {
    metaType: MetaType;
    name: string;
    comment: string;
    meta: TypeMeta;
    assignType: AssignType;
    exportType: ExportType;
    check: ((file: string, field: string, value: any) => void)[];
}

type Check = ((file: string, field: string, value: any) => void)[];
type ClassTuple = (metaType: MetaType, langueType: LangueType, exportType?: ExportType) => string;

declare interface BuiltinMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: ExportType, check?: Check, assignType?: AssignType): VarMeta;
}

declare interface ArrayTypeMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: ExportType, check?: Check, assignType?: AssignType): VarMeta;

    element: TypeMeta;
}

declare interface TableTypeMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: ExportType, check?: Check, assignType?: AssignType): VarMeta;

    value: TypeMeta;
}

declare interface TupleTypeMeta extends TypeMeta {
    (name: string, comment?: string, exportType?: ExportType, check?: ((file: string, field: string, value: any) => void)[], assignType?: AssignType): VarMeta;

    fields: Array<VarMeta>;
    comment: string;
}


declare interface EnumTypeMeta extends TypeMeta {
    (name: string, comment?: string, value?: number, otherItem?: string): EnumMeta;
    fields: Array<EnumMeta>;
    comment: string;
}

declare interface EnumMeta extends VarMeta {
    value: number;
    otherItem: string;
}

declare interface RecordMeta {
    name: string;
    meta: TypeMeta;
    comment?: string;
}

interface FileMeta {
    type: FileType,
    name: string,
    jsonName: string;
    format: ExportType,
    element?: TupleTypeMeta,
    key?: string,
    priority: boolean,
}

declare interface ProtocolMeta {
    name: string,
    group: number;
    channel: number;
    meta: TupleTypeMeta;
    comment: string;
    metaRpc: TupleTypeMeta;
}

declare type ProtocolArray = ProtocolMeta[];
declare type ProtocolSegment = [number, number, number, number];
declare type ProtocolChannel = [ProtocolSegment, Array<ProtocolMeta>][];
declare type ProtocolGroup = ProtocolChannel[];
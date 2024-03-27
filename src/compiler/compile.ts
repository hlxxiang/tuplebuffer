import { Log } from "../utils/log";

export const T: string = "    ";

function builtinCommon(metaType: MetaType, className: string): BuiltinMeta {
    let result: BuiltinMeta = <BuiltinMeta>function (name: string, comment?: string, exportType: ExportType = ExportType.All, check: Check = null, assignType: AssignType = AssignType.Type): VarMeta {
        return {
            metaType: metaType,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        }
    };
    result.metaType = metaType;
    result.className = className;
    return result;
}

export const string: BuiltinMeta = (() => {
    return builtinCommon(MetaType.string, MetaName.string);
})();

export const int32: BuiltinMeta = (() => {
    return builtinCommon(MetaType.int32, MetaName.int32);
})();

export const int64: BuiltinMeta = (() => {
    return builtinCommon(MetaType.int64, MetaName.int64);
})();

export const float: BuiltinMeta = (() => {
    return builtinCommon(MetaType.float, MetaName.float);
})();

export const double: BuiltinMeta = (() => {
    return builtinCommon(MetaType.double, MetaName.double);
})();

export const boolean: BuiltinMeta = (() => {
    return builtinCommon(MetaType.boolean, MetaName.boolean);
})();

export const buffer: BuiltinMeta = (() => {
    return builtinCommon(MetaType.buffer, MetaName.buffer);
})();

export function array(varType: BuiltinMeta | TableTypeMeta | TupleTypeMeta): ArrayTypeMeta {
    let result: ArrayTypeMeta = <ArrayTypeMeta>function (name: string, comment?: string, exportType: ExportType = ExportType.All, check: Check = null, assignType: AssignType = AssignType.Type): VarMeta {
        return {
            metaType: MetaType.array,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        }
    };
    if (MetaType.tuple == varType.metaType) {
        checkTupleNames.set(varType.className, checkTupleNames.get(varType.className) + 1);
    }
    result.metaType = MetaType.array;
    result.className = MetaName.array;
    result.element = varType;
    return result;
}

export function table(varType: TypeMeta): TableTypeMeta {
    let result: TableTypeMeta = <TableTypeMeta>function (name: string, comment?: string, exportType: ExportType = ExportType.All, check: Check = null, assignType: AssignType = AssignType.Type): VarMeta {
        return {
            metaType: MetaType.table,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        }
    };
    if (MetaType.tuple == varType.metaType) {
        checkTupleNames.set(varType.className, checkTupleNames.get(varType.className) + 1);
    }
    result.metaType = MetaType.table;
    result.className = MetaName.table;
    result.value = varType;
    return result;
}

export let declareTypes: Array<TupleTypeMeta> = []
export let checkTupleNames = new Map<string, number>();

export function tuple(className: string, fields: Array<VarMeta>, comment?: string): TupleTypeMeta {
    if (declareTypes.find((e) => e.className == className) != null) {
        Log.instance.error(`类型名${className}重复。`);
        throw new Error(`类型名${className}重复。`);
    }
    checkTupleNames.set(className, 0);
    let result: TupleTypeMeta = <TupleTypeMeta>function (name: string, comment?: string, exportType: ExportType = ExportType.All, check: Check = null, assignType: AssignType = AssignType.Type): VarMeta {
        return {
            metaType: MetaType.tuple,
            name: name,
            comment: comment,
            meta: result,
            exportType: exportType,
            check: check,
            assignType: assignType,
        }
    };
    result.metaType = MetaType.tuple;
    result.className = className;
    result.fields = fields;
    result.comment = comment;
    declareTypes.push(result);
    return result;
}
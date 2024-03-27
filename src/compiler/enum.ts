import { Log } from "../utils/log";

function builtinEnum() {
    let result: EnumTypeMeta = <EnumTypeMeta>function (name: string, comment?: string, value?: number, otherItem?: string, check?: ((value: any) => void)[]): EnumMeta {
        return {
            metaType: MetaType.enum,
            name: name,
            value: value,
            otherItem: otherItem,
            comment: comment,
            meta: result,
            assignType: AssignType.Type,
            exportType: ExportType.All,
            check: check,
        }
    };
    result.metaType = MetaType.enum;
    result.className = MetaName.enum;
    return result;
}

export const enumItem: EnumTypeMeta = (() => {
    return builtinEnum();
})();

export let declareEnums: Array<EnumTypeMeta> = []

export function enums(className: string, fields: Array<EnumMeta>, comment?: string): EnumTypeMeta {
    if (declareEnums.find((e) => e.className == className) != null) {
        Log.instance.error(`类型名${className}重复。`);
        throw new Error(`类型名${className}重复。`);
    }

    let result: EnumTypeMeta = <EnumTypeMeta>function (name: string, comment?: string, value?: number, otherItem?: string, check?: ((value: any) => void)[]): EnumMeta {
        return {
            metaType: MetaType.int64,
            value: value,
            otherItem: otherItem,
            name: name,
            comment: comment,
            meta: result,
            assignType: AssignType.Type,
            exportType: ExportType.All,
            check: check,
        }
    };
    result.metaType = MetaType.tuple;
    result.fields = fields;
    result.comment = comment;
    result.className = className;
    declareEnums.push(result);
    return result;
}
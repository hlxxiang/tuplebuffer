import * as fs from "fs";
import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { TupleBase } from "../base/tuple_base";

export abstract class CS extends TupleBase {
    protected content: string = "";

    protected addContent(content: string): void {
        this.content += content;
    }

    protected override classSource(typeMeta: TypeMeta, exportType?: ExportType, addOptional: boolean = false): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_CS.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_CS.int32}`;
        }
        else if (MetaType.uint32 == metaType) {
            content = `${TypeName_CS.uint32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_CS.int64}`;
        }
        else if (MetaType.uint64 == metaType) {
            content = `${TypeName_CS.uint64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_CS.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_CS.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_CS.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_CS.buffer}`;
        }
        else if (MetaType.array == metaType) {
            // content = `std::vector<${(typeMeta as ArrayTypeMeta).element.className}>`;
            content = `${typeMeta.className}[]`;
        }
        else if (MetaType.table == metaType) {
            content = `Table<${typeMeta.className}>`;
        }
        else if (MetaType.tuple == metaType) {
            exportType = exportType == null ? ExportType.All : exportType;
            const fields = (typeMeta as TupleTypeMeta).fields;
            exportType = exportType == null ? ExportType.All : exportType;
            if (fields != null && fields.length != 0) {
                let source = "[";
                let first = true;
                for (const field of fields) {
                    if ((field.exportType & exportType)) {
                        if (!first) {
                            source += ", ";
                        }
                        source += field.meta.className;
                        first = false;
                    }
                }
                source += "]";
                content = first ? "null" : source;
            }
            content = "null";
        }
        return content;
    }

    protected override className(typeMeta: TypeMeta): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_CS.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_CS.int32}`;
        }
        else if (MetaType.uint32 == metaType) {
            content = `${TypeName_CS.uint32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_CS.int64}`;
        }
        else if (MetaType.uint64 == metaType) {
            content = `${TypeName_CS.uint64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_CS.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_CS.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_CS.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_CS.buffer}`;
        }
        else if (MetaType.array == metaType) {
            // content = `std::vector<${(typeMeta as ArrayTypeMeta).element.className}>`;
            let element = (typeMeta as ArrayTypeMeta).element;
            content = `${this.className(element)}[]`;
        }
        else if (MetaType.table == metaType) {
            content = `Table<${typeMeta.className}>`;
        }
        else if (MetaType.tuple == metaType) {
            content = typeMeta.className
        }
        return content;
    }

    protected override compileTuple(meta: TupleTypeMeta, indexSuffix: string, interfaceName: string, exportType: ExportType): void {
        this.compileTupleIndex(meta, indexSuffix, interfaceName, exportType);
    }

    protected compileTupleIndex(meta: TupleTypeMeta, indexSuffix: string, interfaceName: string, exportType: ExportType): void {
        let names: Table<boolean> = Object.create(null);
        let content = "";
        if (meta.comment != null) {
            content += `\n${T}${T}/// <summary> ${meta.comment} </summary>`;
        }
        let fields = meta.fields;
        content += `\n${T}${T}[MessagePackObject(true)]\n${T}${T}public class ${meta.className} : ${interfaceName}\n${T}${T}{`;
        fields = meta.fields;
        if (fields != null) {
            let index = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (names[name]) {
                    Log.instance.error(`${meta.className} 存在重复的属性：${name}.`);
                    throw new Error(`${meta.className} 存在重复的属性：${name}.`);
                }
                names[name] = true;
                if (field.exportType & exportType) {
                    let comment = field.comment;
                    if (comment != null) {
                        content += `\n${T}${T}${T}/// <summary> ${comment} </summary>`;
                    }
                    content += `\n${T}${T}${T}[Key(${index})]\n${T}${T}${T}public ${this.className(field.meta)} ${name} { get; set; }`;
                    index++;
                }
            }
        }
        content += `\n${T}${T}}\n`;
        this.addContent(content);
    }

    public override saveFile(): void {
        this.addContent(`${T}}\n}`);
        {
            let file = `${this.path}/${this.fileName}.cs`;
            fs.writeFileSync(file, this.content, { encoding: 'utf8' });
            Log.instance.debug(file);
        }
    }
}
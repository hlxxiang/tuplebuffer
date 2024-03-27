import * as fs from "fs";
import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { TupleBase } from "../base/tuple_base";

export abstract class TS extends TupleBase {
    protected content: string = "";

    protected addContent(content: string): void {
        this.content += content;
    }

    protected override classSource(typeMeta: TypeMeta, exportType?: ExportType, addOptional: boolean = false): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_TS.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_TS.int32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_TS.int64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_TS.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_TS.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_TS.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_TS.buffer}`;
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
                        source += this.className(field.meta);
                        first = false;
                    }
                }
                source += "]";
                content = first ? "null" : source;
            }
            else {
                content = "null";
            }
        }
        return content;
    }

    protected override className(typeMeta: TypeMeta): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_TS.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_TS.int32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_TS.int64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_TS.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_TS.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_TS.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_TS.buffer}`;
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

    protected override compileTuple(meta: TupleTypeMeta, indexSuffix: string, exportType: ExportType): void {
        this.compileTupleIndex(meta, indexSuffix, exportType);
        this.compileTupleInterface(meta, indexSuffix, exportType);
        this.compileTupleType(meta, exportType);
    }

    protected compileTupleIndex(meta: TupleTypeMeta, indexSuffix: string, exportType: ExportType): void {
        let names: Table<boolean> = Object.create(null);
        let content = "";
        if (meta.comment != null) {
            content += `\n${T}/** ${meta.comment}\n${T} */`;
        }
        let fields = meta.fields;
        content += `\n${T}const enum ${meta.className}${indexSuffix}{\n`;
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
                        content += `${T}${T}/** ${comment} */\n`;
                    }
                    content += `${T}${T}${name} = ${index++},\n`;
                }
            }
        }
        content += `\n${T}}\n`;
        this.addContent(content);
    }

    protected compileTupleInterface(meta: TupleTypeMeta, indexSuffix: string, exportType: ExportType): void {
        let content = `${T}interface ${meta.className}Types {\n`;
        let fields = meta.fields;
        if (fields != null) {
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    content += `${T}${T}[${meta.className}${indexSuffix}.${name}]: ${this.className(field.meta)};\n`;
                }
            }
        }
        content += `${T}}\n`;
        this.addContent(content);
    }

    protected compileTupleType(meta: TupleTypeMeta, exportType: ExportType): void {
        let content: string = "";
        if (meta.comment != null) {
            content += `${T}/** ${meta.comment} */\n`;
        }
        content += `${T}type ${meta.className} = ${this.classSource(meta, exportType)};\n`;
        this.addContent(content);
    }

    public override saveFile(): void {
        this.addContent("\n}");
        {
            let file = `${this.path}/${this.fileName}.d.ts`;
            fs.writeFileSync(file, this.content, { encoding: 'utf8' });
            Log.instance.debug(file);
        }
    }
}
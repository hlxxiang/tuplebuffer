import * as fs from "fs";
import { checkTupleNames, T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { TupleBase } from "../base/tuple_base";

export abstract class CPP extends TupleBase {

    protected headFileContent: string = "";
    protected sourceFileConext: string = "";

    protected addHeadContent(content: string): void {
        this.headFileContent += content;
    }
    protected addSourceContent(content: string): void {
        this.sourceFileConext += content;
    }

    protected hasArrayBuiltinElement(metaType: MetaType): boolean {
        if (MetaType.string == metaType ||
            MetaType.int32 == metaType ||
            MetaType.uint32 == metaType ||
            MetaType.int64 == metaType ||
            MetaType.uint64 == metaType ||
            MetaType.float == metaType ||
            MetaType.double == metaType ||
            MetaType.boolean == metaType ||
            MetaType.buffer == metaType ||
            MetaType.array == metaType) {
            return true;
        }
        return false;
    }

    protected override classSource(typeMeta: TypeMeta, exportType?: ExportType, addOptional: boolean = false): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_CPP.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_CPP.int32}`;
        }
        else if (MetaType.uint32 == metaType) {
            content = `${TypeName_CPP.uint32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_CPP.int64}`;
        }
        else if (MetaType.uint64 == metaType) {
            content = `${TypeName_CPP.uint64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_CPP.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_CPP.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_CPP.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_CPP.buffer}`;
        }
        else if (MetaType.array == metaType) {
            // content = `std::vector<${(typeMeta as ArrayTypeMeta).element.className}>`;
            content = `std::vector<${this.tuple((typeMeta as ArrayTypeMeta).element)}>`;
        }
        else if (MetaType.table == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (MetaType.tuple == metaType) {
            exportType = exportType == null ? ExportType.All : exportType;
            const fields = (typeMeta as TupleTypeMeta).fields;
            if (fields != null && fields.length != 0) {
                let source = "";
                let first = true;
                for (const field of fields) {
                    if (MetaType.tuple == field.meta.metaType) {
                        checkTupleNames.set(field.meta.className, checkTupleNames.get(field.meta.className) + 1);
                    }
                    if ((field.exportType & exportType)) {
                        if (!first) {
                            source += ", ";
                        }
                        source += `${this.tuple(field.meta, exportType)}`;
                        first = false;
                    }
                }
                source += "";
                content = first ? `std::nullopt_t` : source;
                if (first) {
                    addOptional = false;
                }
            }
            else {
                content = `std::nullopt_t`;
                addOptional = false;
            }
        }
        if (addOptional) {
            return `std::shared_ptr<${content}>`;
        }
        else {
            return content;
        }
    }

    protected tuple(typeMeta: TypeMeta, exportType?: ExportType): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_CPP.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_CPP.int32}`;
        }
        else if (MetaType.uint32 == metaType) {
            content = `${TypeName_CPP.uint32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_CPP.int64}`;
        }
        else if (MetaType.uint64 == metaType) {
            content = `${TypeName_CPP.uint64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_CPP.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_CPP.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_CPP.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_CPP.buffer}`;
        }
        else if (MetaType.array == metaType) {
            // content = `std::vector<${(typeMeta as ArrayTypeMeta).element.className}>`;
            content = `std::shared_ptr<std::vector<${this.tuple((typeMeta as ArrayTypeMeta).element)}>>`;
        }
        else if (MetaType.table == metaType) {
            content = `std::shared_ptr<std::unordered_map<std::sting, ${typeMeta.className}::Tuple>>`;
        }
        else if (MetaType.tuple == metaType) {
            content = `std::shared_ptr<${typeMeta.className}::Tuple>`;
        }
        else {
            content = `std::shared_ptr<Enum::${typeMeta.className}>`;
        }
        return content;
    }

    protected override className(typeMeta: TypeMeta, addOptional: boolean = false): string {
        let add: boolean = false;
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_CPP.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_CPP.int32}`;
        }
        else if (MetaType.uint32 == metaType) {
            content = `${TypeName_CPP.uint32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_CPP.int64}`;
        }
        else if (MetaType.uint64 == metaType) {
            content = `${TypeName_CPP.uint64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_CPP.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_CPP.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_CPP.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_CPP.buffer}`;
        }
        else if (MetaType.array == metaType) {
            // content = `std::vector<${(typeMeta as ArrayTypeMeta).element.className}>`;
            content = `std::vector<${this.className((typeMeta as ArrayTypeMeta).element, true)}>`;
            add = true;
        }
        else if (MetaType.table == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
            add = true;
        }
        else if (MetaType.tuple == metaType) {
            content = `${typeMeta.className}`;
            add = true;
        }
        if (add && addOptional) {
            return `std::shared_ptr<${content}>`;
        }
        else {
            return content;
        }
    }

    protected classTuple(typeMeta: TypeMeta, exportType?: ExportType, addOptional: boolean = false): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType) {
            content = `${TypeName_CPP.string}`;
        }
        else if (MetaType.int32 == metaType) {
            content = `${TypeName_CPP.int32}`;
        }
        else if (MetaType.uint32 == metaType) {
            content = `${TypeName_CPP.uint32}`;
        }
        else if (MetaType.int64 == metaType) {
            content = `${TypeName_CPP.int64}`;
        }
        else if (MetaType.uint64 == metaType) {
            content = `${TypeName_CPP.uint64}`;
        }
        else if (MetaType.float == metaType) {
            content = `${TypeName_CPP.float}`;
        }
        else if (MetaType.double == metaType) {
            content = `${TypeName_CPP.double}`;
        }
        else if (MetaType.boolean == metaType) {
            content = `${TypeName_CPP.boolean}`;
        }
        else if (MetaType.buffer == metaType) {
            content = `${TypeName_CPP.buffer}()`;
        }
        else if (MetaType.array == metaType) {
            //content = `std::vector<${(typeMeta as ArrayTypeMeta).element.className}>`;
            content = `std::vector<${this.tuple((typeMeta as ArrayTypeMeta).element)}>`;
        }
        else if (MetaType.table == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (MetaType.tuple == metaType) {
            content = `${typeMeta.className}::Tuple`;
        }
        if (addOptional) {
            return `std::shared_ptr<${content}>`;
        }
        else {
            return content;
        }
    }

    protected encode(typeMeta: TypeMeta, exportType?: ExportType, name?: string, i?: number): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType ||
            MetaType.int32 == metaType ||
            MetaType.uint32 == metaType ||
            MetaType.int64 == metaType ||
            MetaType.uint64 == metaType ||
            MetaType.float == metaType ||
            MetaType.double == metaType ||
            MetaType.boolean == metaType ||
            MetaType.buffer == metaType) {
            if (i == undefined) {
                content = `obj->${name}`;
            }
            else {
                content = `obj->${name}[i]`;
            }
        }
        else if (MetaType.array == metaType) {
            if (i == undefined) {
                if (this.hasArrayBuiltinElement((typeMeta as ArrayTypeMeta).element.metaType)) {
                    content = `${name}`;
                }
                else {
                    content = `${typeMeta.className}Encode(${name})`;
                }
            }
            else {
                if (this.hasArrayBuiltinElement((typeMeta as ArrayTypeMeta).element.metaType)) {
                    content = `${name}[i]`;
                }
                else {
                    content = `${(typeMeta as ArrayTypeMeta).element.className}Encode(${name}[i])`;
                }
            }
        }
        else if (MetaType.table == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (MetaType.tuple == metaType) {
            if (i == undefined) {
                content = `${typeMeta.className}Encode(obj->${name})`;
            }
            else {
                content = `${typeMeta.className}Encode(obj->${name}[i])`;
            }
        }
        return content;
    }

    protected decode(typeMeta: TypeMeta, exportType?: ExportType, name?: string, i?: number): string {
        const metaType = typeMeta.metaType;
        let content = "";
        if (MetaType.string == metaType ||
            MetaType.int32 == metaType ||
            MetaType.uint32 == metaType ||
            MetaType.int64 == metaType ||
            MetaType.uint64 == metaType ||
            MetaType.float == metaType ||
            MetaType.double == metaType ||
            MetaType.boolean == metaType ||
            MetaType.buffer == metaType) {
            content = `std::get<${i}>(*t.get())`;
        }
        else if (MetaType.array == metaType) {
            if (this.hasArrayBuiltinElement((typeMeta as ArrayTypeMeta).element.metaType)) {
                content = `${name}[i]`;
            }
            else {
                content = `${(typeMeta as ArrayTypeMeta).element.className}Decode(${name}[i])`;
            }
        }
        else if (MetaType.table == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (MetaType.tuple == metaType) {
            content = `${typeMeta.className}Decode(std::get<${i}>(*t.get()))`;
        }
        return content;
    }

    protected override compileTuple(meta: TupleTypeMeta, indexSuffix: string, interfaceName: string, exportType: ExportType): void {
        this.compileTupleIndex(meta, indexSuffix, interfaceName, exportType);
        this.compileTupleTypeEncode(meta, exportType);
        this.compileTupleIndexEncode(meta, indexSuffix, exportType);
        this.compileTupleTypeDecode(meta, exportType);
        this.compileTupleIndexDecode(meta, indexSuffix, exportType);
    }

    protected compileTupleIndex(meta: TupleTypeMeta, indexSuffix: string, interfaceName: string, exportType: ExportType): void {
        let content = "";
        if (meta.comment != null) {
            content += `\n${T}${T}/* ${meta.comment} */`;
        }
        content += `\n${T}${T}struct ${meta.className} : public ${interfaceName}\n${T}${T}{\n${T}${T}${T}using Tuple = std::tuple<${this.classSource(meta, exportType)}>;\n`;
        let fields = meta.fields;
        if (fields != null) {
            let index = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    let comment = field.comment;

                    if (comment != null) {
                        content += `${T}${T}${T}/* ${comment} */\n`;
                    }
                    content += `${T}${T}${T}${this.className(field.meta, true)} ${name};\n`;
                    index++
                }
            }
        }
        content += `${T}${T}};`;
        this.addHeadContent(content);
    }

    protected compileTupleTypeEncode(meta: TupleTypeMeta, exportType: ExportType): void {
        {
            let content = `\n${T}${T}${this.classTuple(meta, exportType, true)} ${meta.className}Encode(const std::shared_ptr<${meta.className}>& obj);`;
            this.addHeadContent(content);
        }
        {
            let content = `\n${T}${T}${this.classTuple(meta, exportType, true)} ${meta.className}Encode(const std::shared_ptr<${meta.className}>& obj)\n${T}${T}{`;
            this.addSourceContent(content);
        }
    }

    protected compileTupleIndexEncode(meta: TupleTypeMeta, indexSuffix: string, exportType: ExportType): void {
        let names: Table<boolean> = Object.create(null);
        let fields = meta.fields;
        let content = `\n${T}${T}${T}if (obj != nullptr)\n${T}${T}${T}{`;
        if (fields != null) {
            let ret = ``
            let arrSize = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    if (MetaType.array == field.meta.metaType) {
                        arrSize++;
                        if (field.metaType == MetaType.array || field.metaType == MetaType.tuple) {
                            ret += `\n${T}${T}${T}${T}${this.classTuple(field.meta, exportType, true)} ${name}Arr;`;
                            ret += `\n${T}${T}${T}${T}if (obj->${name} != nullptr)`;
                            ret += `\n${T}${T}${T}${T}{`;
                            ret += `\n${T}${T}${T}${T}${T}${name}Arr = make_shared<${this.classTuple(field.meta, exportType, false)}>();`;
                            ret += `\n${T}${T}${T}${T}${T}auto& value = *${name}Arr.get();`;
                            ret += `\n${T}${T}${T}${T}${T}auto& ${name} = *obj->${name}.get();`;
                            ret += `\n${T}${T}${T}${T}${T}for (auto i = 0; i < ${name}.size(); ++i)`;
                            ret += `\n${T}${T}${T}${T}${T}{`;
                            ret += `\n${T}${T}${T}${T}${T}${T}value.push_back(${this.encode(field.meta, exportType, name, i)});`;
                            ret += `\n${T}${T}${T}${T}${T}}`;
                            ret += `\n${T}${T}${T}${T}}`;
                        }
                    }
                }
            }
            content += ret;
            content += arrSize > 0 ? "" : "";
        }
        let exportIndex = 0;
        if (fields != null) {
            if (fields.length > 0) {
                for (let i = 0; i < fields.length; ++i) {
                    let field = fields[i];
                    let name = field.name;
                    if (names[name]) {
                        throw new Error(`${meta.className} 存在重复的属性：${name}.`);
                    }
                    names[name] = true;
                    if (field.exportType & exportType) {
                        exportIndex++;
                    }
                }
            }
        }
        if (exportIndex > 0) {
            let str = `\n${T}${T}${T}${T}return make_shared<${meta.className}::Tuple>(`;
            if (fields != null) {
                if (fields.length > 0) {
                    let index = 0;
                    let ret = ""
                    for (let i = 0; i < fields.length; ++i) {
                        let field = fields[i];
                        let name = field.name;
                        if (field.exportType & exportType) {
                            if (0 != index) {
                                ret += ", ";
                            }
                            let comment = field.comment;
                            if (MetaType.array == field.meta.metaType) {
                                ret += `${name}Arr`
                            }
                            else {
                                ret += `${this.encode(field.meta, exportType, name)}`;
                            }
                            index++;
                        }
                    }
                    str += ret;
                }
            }
            str += `);\n${T}${T}${T}}`;
            str += `\n${T}${T}${T}else\n${T}${T}${T}{`;
            str += `\n${T}${T}${T}${T}return nullptr;\n${T}${T}${T}}`
            content += str + `\n${T}${T}}`;
        }
        else {
            content = `\n${T}${T}${T}return nullptr;\n${T}${T}}`
        }
        this.addSourceContent(content);
    }

    protected compileTupleTypeDecode(meta: TupleTypeMeta, exportType: ExportType): void {
        {
            let content = `\n${T}${T}std::shared_ptr<${meta.className}> ${meta.className}Decode(const ${this.classTuple(meta, exportType, true)}& t);\n`;
            this.addHeadContent(content);
        }
        {
            let content = `\n${T}${T}std::shared_ptr<${meta.className}> ${meta.className}Decode(const ${this.classTuple(meta, exportType, true)}& t)\n${T}${T}{`;
            this.addSourceContent(content);
        }
    }

    protected compileTupleIndexDecode(meta: TupleTypeMeta, indexSuffix: string, exportType: ExportType): void {
        let names: Table<boolean> = Object.create(null);
        let fields = meta.fields;
        let content = `\n${T}${T}${T}${this.className(meta, true)} obj;`;
        content += `\n${T}${T}${T}if (t != nullptr)\n${T}${T}${T}{`;
        content += `\n${T}${T}${T}${T}obj = make_shared<${this.className(meta, false)}>();`;
        if (fields != null) {
            let ret = ""
            let index = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    let comment = field.comment;
                    if (MetaType.array == field.meta.metaType) {
                        if (field.metaType == MetaType.array || field.metaType == MetaType.tuple) {
                            ret += `\n${T}${T}${T}${T}auto& ${name}_t = std::get<${index}>(*t.get());`;
                            ret += `\n${T}${T}${T}${T}if (${name}_t != nullptr)`;
                            ret += `\n${T}${T}${T}${T}{`;
                            ret += `\n${T}${T}${T}${T}${T}obj->${name} = make_shared<${this.className(field.meta, false)}>();`;
                            ret += `\n${T}${T}${T}${T}${T}auto& ${name} = *${name}_t.get();`;
                            ret += `\n${T}${T}${T}${T}${T}auto& value = *obj->${name}.get();`;
                            ret += `\n${T}${T}${T}${T}${T}for (auto i = 0; i < ${name}.size(); ++i)`;
                            ret += `\n${T}${T}${T}${T}${T}{`;
                            ret += `\n${T}${T}${T}${T}${T}${T}value.push_back(${this.decode(field.meta, exportType, name, i)});`;
                            ret += `\n${T}${T}${T}${T}${T}}`;
                            ret += `\n${T}${T}${T}${T}}`;
                        }
                    }
                    index++;
                }
            }
            content += ret;
        }
        let exportIndex = 0;
        if (fields != null) {
            if (fields.length > 0) {
                for (let i = 0; i < fields.length; ++i) {
                    let field = fields[i];
                    let name = field.name;
                    if (names[name]) {
                        throw new Error(`${meta.className} 存在重复的属性：${name}.`);
                    }
                    names[name] = true;
                    if (field.exportType & exportType) {
                        exportIndex++;
                    }
                }
            }
        }
        if (exportIndex > 0) {
            if (fields != null) {
                let ret = ""
                let index = 0;
                for (let i = 0; i < fields.length; ++i) {
                    let field = fields[i];
                    let name = field.name;
                    if (field.exportType & exportType) {
                        let comment = field.comment;
                        if (MetaType.array != field.meta.metaType) {
                            ret += `\n${T}${T}${T}${T}obj->${field.name} = ${this.decode(field.meta, exportType, name, index)};`;
                        }
                        index++;
                    }
                }
                content += ret;
            }
            content += `\n${T}${T}${T}}\n${T}${T}${T}return obj;\n${T}${T}}\n`;
        }
        else {
            content = `\n${T}${T}${T}return nullptr;\n${T}${T}}\n`;
        }
        this.addSourceContent(content);
    }

    public override saveFile(): void {
        this.addHeadContent(`\n${T}}\n}`);
        this.addSourceContent(`\n${T}}\n}`);
        {
            let file = `${this.path}/${this.fileName}.h`;
            fs.writeFileSync(file, this.headFileContent, { encoding: 'utf8' });
            Log.instance.debug(file);
        }
        {
            let file = `${this.path}/${this.fileName}.cpp`;
            fs.writeFileSync(file, this.sourceFileConext, { encoding: 'utf8' });
            Log.instance.debug(file);
        }
    }
}
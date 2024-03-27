"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPP = void 0;
const fs = require("fs");
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const tuple_base_1 = require("../base/tuple_base");
class CPP extends tuple_base_1.TupleBase {
    constructor() {
        super(...arguments);
        this.headFileContent = "";
        this.sourceFileConext = "";
    }
    addHeadContent(content) {
        this.headFileContent += content;
    }
    addSourceContent(content) {
        this.sourceFileConext += content;
    }
    hasArrayBuiltinElement(metaType) {
        if (1 == metaType ||
            2 == metaType ||
            3 == metaType ||
            4 == metaType ||
            5 == metaType ||
            6 == metaType ||
            7 == metaType ||
            8 == metaType) {
            return true;
        }
        return false;
    }
    classSource(typeMeta, exportType, addOptional = false) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"int32"}`;
        }
        else if (3 == metaType) {
            content = `${"int64"}`;
        }
        else if (4 == metaType) {
            content = `${"float"}`;
        }
        else if (5 == metaType) {
            content = `${"double"}`;
        }
        else if (6 == metaType) {
            content = `${"bool"}`;
        }
        else if (7 == metaType) {
            content = `${"std::vector<unsigned char>"}`;
        }
        else if (8 == metaType) {
            content = `std::vector<${this.tuple(typeMeta.element)}>`;
        }
        else if (9 == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (10 == metaType) {
            exportType = exportType == null ? 3 : exportType;
            const fields = typeMeta.fields;
            if (fields != null && fields.length != 0) {
                let source = "";
                let first = true;
                for (const field of fields) {
                    if (10 == field.meta.metaType) {
                        compile_1.checkTupleNames.set(field.meta.className, compile_1.checkTupleNames.get(field.meta.className) + 1);
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
            return `std::optional<${content}>`;
        }
        else {
            return content;
        }
    }
    tuple(typeMeta, exportType) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"int32"}`;
        }
        else if (3 == metaType) {
            content = `${"int64"}`;
        }
        else if (4 == metaType) {
            content = `${"float"}`;
        }
        else if (5 == metaType) {
            content = `${"double"}`;
        }
        else if (6 == metaType) {
            content = `${"bool"}`;
        }
        else if (7 == metaType) {
            content = `${"std::vector<unsigned char>"}`;
        }
        else if (8 == metaType) {
            content = `std::vector<${this.tuple(typeMeta.element)}>`;
        }
        else if (9 == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (10 == metaType) {
            content = `${typeMeta.className}::Tuple`;
        }
        else {
            content = `Enum::${typeMeta.className}`;
        }
        return `std::optional<${content}>`;
    }
    className(typeMeta, addOptional = false) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"int32"}`;
        }
        else if (3 == metaType) {
            content = `${"int64"}`;
        }
        else if (4 == metaType) {
            content = `${"float"}`;
        }
        else if (5 == metaType) {
            content = `${"double"}`;
        }
        else if (6 == metaType) {
            content = `${"bool"}`;
        }
        else if (7 == metaType) {
            content = `${"std::vector<unsigned char>"}`;
        }
        else if (8 == metaType) {
            content = `std::vector<${this.className(typeMeta.element, true)}>`;
        }
        else if (9 == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (10 == metaType) {
            content = `${typeMeta.className}`;
        }
        if (addOptional) {
            return `std::optional<${content}>`;
        }
        else {
            return content;
        }
    }
    classTuple(typeMeta, exportType, addOptional = false) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"int32"}`;
        }
        else if (3 == metaType) {
            content = `${"int64"}`;
        }
        else if (4 == metaType) {
            content = `${"float"}`;
        }
        else if (5 == metaType) {
            content = `${"double"}`;
        }
        else if (6 == metaType) {
            content = `${"bool"}`;
        }
        else if (7 == metaType) {
            content = `${"std::vector<unsigned char>"}()`;
        }
        else if (8 == metaType) {
            content = `std::vector<${this.tuple(typeMeta.element)}>`;
        }
        else if (9 == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (10 == metaType) {
            content = `${typeMeta.className}::Tuple`;
        }
        if (addOptional) {
            return `std::optional<${content}>`;
        }
        else {
            return content;
        }
    }
    encode(typeMeta, exportType, name, i) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType ||
            2 == metaType ||
            3 == metaType ||
            4 == metaType ||
            5 == metaType ||
            6 == metaType ||
            7 == metaType) {
            if (i == undefined) {
                content = `oValue.${name}`;
            }
            else {
                content = `oValue.${name}[i]`;
            }
        }
        else if (8 == metaType) {
            if (i == undefined) {
                if (this.hasArrayBuiltinElement(typeMeta.element.metaType)) {
                    content = `${name}`;
                }
                else {
                    content = `${typeMeta.className}Encode(${name})`;
                }
            }
            else {
                if (this.hasArrayBuiltinElement(typeMeta.element.metaType)) {
                    content = `${name}[i]`;
                }
                else {
                    content = `${typeMeta.element.className}Encode(${name}[i])`;
                }
            }
        }
        else if (9 == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (10 == metaType) {
            if (i == undefined) {
                content = `${typeMeta.className}Encode(oValue.${name})`;
            }
            else {
                content = `${typeMeta.className}Encode(oValue.${name}[i])`;
            }
        }
        return content;
    }
    decode(typeMeta, exportType, name, i) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType ||
            2 == metaType ||
            3 == metaType ||
            4 == metaType ||
            5 == metaType ||
            6 == metaType ||
            7 == metaType) {
            content = `std::get<${i}>(tValue)`;
        }
        else if (8 == metaType) {
            if (this.hasArrayBuiltinElement(typeMeta.element.metaType)) {
                content = `${name}[i]`;
            }
            else {
                content = `${typeMeta.element.className}Decode(${name}[i])`;
            }
        }
        else if (9 == metaType) {
            content = `std::unordered_map<std::sting, ${typeMeta.className}::Tuple>`;
        }
        else if (10 == metaType) {
            content = `${typeMeta.className}Decode(std::get<${i}>(tValue))`;
        }
        return content;
    }
    compileTuple(meta, indexSuffix, exportType) {
        this.compileTupleIndex(meta, indexSuffix, exportType);
        this.compileTupleTypeEncode(meta, exportType);
        this.compileTupleIndexEncode(meta, indexSuffix, exportType);
        this.compileTupleTypeDecode(meta, exportType);
        this.compileTupleIndexDecode(meta, indexSuffix, exportType);
    }
    compileTupleIndex(meta, indexSuffix, exportType) {
        let content = "";
        if (meta.comment != null) {
            content += `\n${compile_1.T}/* ${meta.comment} */`;
        }
        content += `\n${compile_1.T}struct ${meta.className}\n${compile_1.T}{\n${compile_1.T}${compile_1.T}using Tuple = std::tuple<${this.classSource(meta, exportType, false)}>;\n`;
        let fields = meta.fields;
        if (fields != null) {
            let index = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    let comment = field.comment;
                    if (comment != null) {
                        content += `${compile_1.T}${compile_1.T}/* ${comment} */\n`;
                    }
                    content += `${compile_1.T}${compile_1.T}${this.className(field.meta, true)} ${name};\n`;
                    index++;
                }
            }
        }
        content += `${compile_1.T}};`;
        this.addHeadContent(content);
    }
    compileTupleTypeEncode(meta, exportType) {
        {
            let content = `\n${compile_1.T}${this.classTuple(meta, exportType, true)} ${meta.className}Encode(std::optional<${meta.className}>& obj);`;
            this.addHeadContent(content);
        }
        {
            let content = `\n${compile_1.T}${this.classTuple(meta, exportType, true)} ${meta.className}Encode(std::optional<${meta.className}>& obj)\n${compile_1.T}{`;
            this.addSourceContent(content);
        }
    }
    compileTupleIndexEncode(meta, indexSuffix, exportType) {
        let names = Object.create(null);
        let fields = meta.fields;
        let content = `\n${compile_1.T}${compile_1.T}if (obj.has_value()) {`;
        if (fields != null) {
            let ret = `\n${compile_1.T}${compile_1.T}${compile_1.T}auto& oValue = obj.value();`;
            let arrSize = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    if (8 == field.meta.metaType) {
                        arrSize++;
                        if (field.metaType == 8 || field.metaType == 10) {
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${this.classTuple(field.meta, exportType, true)} ${name}Arr;`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}if (oValue.${name}.has_value())`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}{`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}${name}Arr = ${this.classTuple(field.meta, exportType, false)}();`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}auto& value = ${name}Arr.value();`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}auto& ${name} = oValue.${name}.value();`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}for (auto i = 0; i < ${name}.size(); ++i)`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}{`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}value.push_back(${this.encode(field.meta, exportType, name, i)});`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}}`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}}`;
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
            let str = `\n${compile_1.T}${compile_1.T}${compile_1.T}return ${meta.className}::Tuple(`;
            if (fields != null) {
                if (fields.length > 0) {
                    let index = 0;
                    let ret = "";
                    for (let i = 0; i < fields.length; ++i) {
                        let field = fields[i];
                        let name = field.name;
                        if (field.exportType & exportType) {
                            if (0 != index) {
                                ret += ", ";
                            }
                            let comment = field.comment;
                            if (8 == field.meta.metaType) {
                                ret += `${name}Arr`;
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
            str += `);\n${compile_1.T}${compile_1.T}}`;
            str += `\n${compile_1.T}${compile_1.T}else {`;
            str += `\n${compile_1.T}${compile_1.T}${compile_1.T}return std::nullopt;\n${compile_1.T}${compile_1.T}}`;
            content += str + `\n${compile_1.T}}`;
        }
        else {
            content = `\n${compile_1.T}${compile_1.T}return std::nullopt;\n${compile_1.T}}`;
        }
        this.addSourceContent(content);
    }
    compileTupleTypeDecode(meta, exportType) {
        {
            let content = `\n${compile_1.T}std::optional<${meta.className}> ${meta.className}Decode(${this.classTuple(meta, exportType, true)}& t);\n`;
            this.addHeadContent(content);
        }
        {
            let content = `\n${compile_1.T}std::optional<${meta.className}> ${meta.className}Decode(${this.classTuple(meta, exportType, true)}& t)\n${compile_1.T}{`;
            this.addSourceContent(content);
        }
    }
    compileTupleIndexDecode(meta, indexSuffix, exportType) {
        let names = Object.create(null);
        let fields = meta.fields;
        let content = `\n${compile_1.T}${compile_1.T}${this.className(meta, true)} obj;`;
        content += `\n${compile_1.T}${compile_1.T}if (t.has_value())\n${compile_1.T}${compile_1.T}{`;
        content += `\n${compile_1.T}${compile_1.T}${compile_1.T}obj = ${this.className(meta, false)}();`;
        content += `\n${compile_1.T}${compile_1.T}${compile_1.T}auto& oValue = obj.value();`;
        content += `\n${compile_1.T}${compile_1.T}${compile_1.T}auto& tValue = t.value();`;
        if (fields != null) {
            let ret = "";
            let index = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    let comment = field.comment;
                    if (8 == field.meta.metaType) {
                        if (field.metaType == 8 || field.metaType == 10) {
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}auto& ${name}_t = std::get<${index}>(tValue);`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}if (${name}_t.has_value())`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}{`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}oValue.${name} = ${this.className(field.meta, false)}();`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}auto& ${name} = ${name}_t.value();`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}auto& value = oValue.${name}.value();`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}for (auto i = 0; i < ${name}.size(); ++i)`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}{`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}value.push_back(${this.decode(field.meta, exportType, name, i)});`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}${compile_1.T}}`;
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}}`;
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
                let ret = "";
                let index = 0;
                for (let i = 0; i < fields.length; ++i) {
                    let field = fields[i];
                    let name = field.name;
                    if (field.exportType & exportType) {
                        let comment = field.comment;
                        if (8 != field.meta.metaType) {
                            ret += `\n${compile_1.T}${compile_1.T}${compile_1.T}oValue.${field.name} = ${this.decode(field.meta, exportType, name, index)};`;
                        }
                        index++;
                    }
                }
                content += ret;
            }
            content += `\n${compile_1.T}${compile_1.T}}\n${compile_1.T}${compile_1.T}return obj;\n${compile_1.T}}\n`;
        }
        else {
            content = `\n${compile_1.T}${compile_1.T}return std::nullopt;\n${compile_1.T}}\n`;
        }
        this.addSourceContent(content);
    }
    saveFile() {
        this.addHeadContent("\n}");
        this.addSourceContent("\n}");
        {
            let file = `${this.path}/${this.fileName}.h`;
            fs.writeFileSync(file, this.headFileContent, { encoding: 'utf8' });
            log_1.Log.instance.debug(file);
        }
        {
            let file = `${this.path}/${this.fileName}.cpp`;
            fs.writeFileSync(file, this.sourceFileConext, { encoding: 'utf8' });
            log_1.Log.instance.debug(file);
        }
    }
}
exports.CPP = CPP;
//# sourceMappingURL=cpp.js.map
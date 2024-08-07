"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS = void 0;
const fs = require("fs");
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const tuple_base_1 = require("../base/tuple_base");
class TS extends tuple_base_1.TupleBase {
    constructor() {
        super(...arguments);
        this.content = "";
    }
    addContent(content) {
        this.content += content;
    }
    classSource(typeMeta, exportType, addOptional = false) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"number"}`;
        }
        else if (3 == metaType) {
            content = `${"number"}`;
        }
        else if (4 == metaType) {
            content = `${"number"}`;
        }
        else if (5 == metaType) {
            content = `${"number"}`;
        }
        else if (6 == metaType) {
            content = `${"boolean"}`;
        }
        else if (7 == metaType) {
            content = `${"Uint8Array"}`;
        }
        else if (8 == metaType) {
            content = `${typeMeta.className}[]`;
        }
        else if (9 == metaType) {
            content = `Table<${typeMeta.className}>`;
        }
        else if (10 == metaType) {
            exportType = exportType == null ? 3 : exportType;
            const fields = typeMeta.fields;
            exportType = exportType == null ? 3 : exportType;
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
    className(typeMeta) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"number"}`;
        }
        else if (3 == metaType) {
            content = `${"number"}`;
        }
        else if (4 == metaType) {
            content = `${"number"}`;
        }
        else if (5 == metaType) {
            content = `${"number"}`;
        }
        else if (6 == metaType) {
            content = `${"boolean"}`;
        }
        else if (7 == metaType) {
            content = `${"Uint8Array"}`;
        }
        else if (8 == metaType) {
            let element = typeMeta.element;
            content = `${this.className(element)}[]`;
        }
        else if (9 == metaType) {
            content = `Table<${typeMeta.className}>`;
        }
        else if (10 == metaType) {
            content = typeMeta.className;
        }
        return content;
    }
    compileTuple(meta, indexSuffix, interfaceName, exportType) {
        this.compileTupleIndex(meta, indexSuffix, interfaceName, exportType);
        this.compileTupleInterface(meta, indexSuffix, exportType);
        this.compileTupleType(meta, exportType);
    }
    compileTupleIndex(meta, indexSuffix, interfaceName, exportType) {
        let names = Object.create(null);
        let content = "";
        if (meta.comment != null) {
            content += `\n${compile_1.T}/** ${meta.comment}\n${compile_1.T} */`;
        }
        let fields = meta.fields;
        content += `\n${compile_1.T}const enum ${meta.className}${indexSuffix}{\n`;
        fields = meta.fields;
        if (fields != null) {
            let index = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (names[name]) {
                    log_1.Log.instance.error(`${meta.className} 存在重复的属性：${name}.`);
                    throw new Error(`${meta.className} 存在重复的属性：${name}.`);
                }
                names[name] = true;
                if (field.exportType & exportType) {
                    let comment = field.comment;
                    if (comment != null) {
                        content += `${compile_1.T}${compile_1.T}/** ${comment} */\n`;
                    }
                    content += `${compile_1.T}${compile_1.T}${name} = ${index++},\n`;
                }
            }
        }
        content += `\n${compile_1.T}}\n`;
        this.addContent(content);
    }
    compileTupleInterface(meta, indexSuffix, exportType) {
        let content = `${compile_1.T}interface ${meta.className}Types {\n`;
        let fields = meta.fields;
        if (fields != null) {
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (field.exportType & exportType) {
                    content += `${compile_1.T}${compile_1.T}[${meta.className}${indexSuffix}.${name}]: ${this.className(field.meta)};\n`;
                }
            }
        }
        content += `${compile_1.T}}\n`;
        this.addContent(content);
    }
    compileTupleType(meta, exportType) {
        let content = "";
        if (meta.comment != null) {
            content += `${compile_1.T}/** ${meta.comment} */\n`;
        }
        content += `${compile_1.T}type ${meta.className} = ${this.classSource(meta, exportType)};\n`;
        this.addContent(content);
    }
    saveFile() {
        this.addContent("\n}");
        {
            let file = `${this.path}/${this.fileName}.d.ts`;
            fs.writeFileSync(file, this.content, { encoding: 'utf8' });
            log_1.Log.instance.debug(file);
        }
    }
}
exports.TS = TS;
//# sourceMappingURL=ts.js.map
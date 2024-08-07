"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CS = void 0;
const fs = require("fs");
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const tuple_base_1 = require("../base/tuple_base");
class CS extends tuple_base_1.TupleBase {
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
            content = `${"Int32"}`;
        }
        else if (3 == metaType) {
            content = `${"Int64"}`;
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
            content = `${"byte[]"}`;
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
    className(typeMeta) {
        const metaType = typeMeta.metaType;
        let content = "";
        if (1 == metaType) {
            content = `${"string"}`;
        }
        else if (2 == metaType) {
            content = `${"Int32"}`;
        }
        else if (3 == metaType) {
            content = `${"Int64"}`;
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
            content = `${"byte[]"}`;
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
    }
    compileTupleIndex(meta, indexSuffix, interfaceName, exportType) {
        let names = Object.create(null);
        let content = "";
        if (meta.comment != null) {
            content += `\n${compile_1.T}/// <summary>\n${compile_1.T}/// ${meta.comment}\n${compile_1.T}/// </summary>*/`;
        }
        let fields = meta.fields;
        content += `\n${compile_1.T}[MessagePackObject]\n${compile_1.T}public class ${meta.className} : ${interfaceName}\n${compile_1.T}{`;
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
                        content += `\n${compile_1.T}${compile_1.T}/// <summary> ${comment} </summary>`;
                    }
                    content += `\n${compile_1.T}${compile_1.T}[Key(${index})]\n${compile_1.T}${compile_1.T}public ${this.className(field.meta)} ${name} { get; set; }`;
                    index++;
                }
            }
        }
        content += `\n${compile_1.T}}\n`;
        this.addContent(content);
    }
    saveFile() {
        this.addContent("\n}");
        {
            let file = `${this.path}/${this.fileName}.cs`;
            fs.writeFileSync(file, this.content, { encoding: 'utf8' });
            log_1.Log.instance.debug(file);
        }
    }
}
exports.CS = CS;
//# sourceMappingURL=cs.js.map
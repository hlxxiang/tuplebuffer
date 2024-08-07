"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumCS = void 0;
const fs = require("fs");
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const enum_base_1 = require("./enum_base");
class EnumCS extends enum_base_1.EnumBase {
    precompile(declaration) {
        let content = `namespace Gen\n{` +
            `\n${compile_1.T}/// <summary> ${declaration} </summary>` +
            `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{`;
        this.addContent(content);
    }
    compileEnumIndex(meta) {
        let names = Object.create(null);
        let content = ``;
        if (meta.comment != null) {
            content += `\n${compile_1.T}${compile_1.T}/// <summary> ${meta.comment} </summary>`;
        }
        content += `\n${compile_1.T}${compile_1.T}public enum ${meta.className}\n${compile_1.T}${compile_1.T}{`;
        let fields = meta.fields;
        if (fields != null) {
            let val = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (names[name]) {
                    log_1.Log.instance.error(`${meta.className} 存在重复的属性：${name}.`);
                    throw new Error(`${meta.className} 存在重复的属性：${name}.`);
                }
                names[name] = true;
                let comment = field.comment;
                let otherItem = field.otherItem;
                let value = field.value;
                let otherValue = 0;
                if (comment != null) {
                    content += `\n${compile_1.T}${compile_1.T}${compile_1.T}/// <summary> ${comment} </summary>`;
                }
                if (otherItem) {
                    if (!this.fieldList.has(otherItem)) {
                        let msg = `${otherItem} 不存在`;
                        throw new Error(msg);
                    }
                    otherValue = this.fieldList.get(otherItem);
                }
                if (otherItem) {
                    content += `\n${compile_1.T}${compile_1.T}${compile_1.T}${name} = ${otherItem},`;
                    val = otherValue;
                }
                else if (null != value && !otherItem) {
                    content += `\n${compile_1.T}${compile_1.T}${compile_1.T}${name} = ${value},`;
                    val = value;
                }
                else {
                    content += `\n${compile_1.T}${compile_1.T}${compile_1.T}${name} = ${val},`;
                }
                this.fieldList.set(`${meta.className}.${name}`, val);
                val += 1;
            }
        }
        content += `\n${compile_1.T}${compile_1.T}}\n`;
        this.addContent(content);
    }
    saveFile() {
        this.addContent(`\n${compile_1.T}}`);
        this.addContent("\n}");
        let file = `${this.path}/${this.fileName}.cs`;
        fs.writeFileSync(file, this.content, { encoding: 'utf8' });
        log_1.Log.instance.debug(file);
    }
}
exports.EnumCS = EnumCS;
//# sourceMappingURL=enum_cs.js.map
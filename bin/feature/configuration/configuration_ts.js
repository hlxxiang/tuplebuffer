"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationTS = void 0;
const compile_1 = require("../../compiler/compile");
const ts_1 = require("../langue/ts");
class ConfigurationTS extends ts_1.TS {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    precompile(declaration) {
        let content = `declare namespace Gen {\n` +
            `${compile_1.T}/*${declaration}*/\n` +
            `${compile_1.T}namespace ${this.namespace} {\n`;
        this.addContent(content);
    }
    compileTypeNames(files, exportType) {
        let content = `\n${compile_1.T}${compile_1.T}const enum StructNames {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${compile_1.T}${compile_1.T}${compile_1.T}/** ${meta.name} */\n`;
                content += `${compile_1.T}${compile_1.T}${compile_1.T}${meta.jsonName} = \"${meta.jsonName}\",\n`;
            }
        }
        content += `${compile_1.T}${compile_1.T}}\n\n`;
        this.addContent(content);
    }
    compileTypes(files, exportType) {
        let content = `${compile_1.T}interface Types {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${compile_1.T}${compile_1.T}/** ${meta.name} */\n`;
                content += `${compile_1.T}${compile_1.T}\"${meta.jsonName}\": ${this.className(meta.element)};\n`;
            }
        }
        content += `${compile_1.T}}\n\n`;
        this.addContent(content);
    }
    compileStruct(files, exportType) {
        let content = `${compile_1.T}${compile_1.T}interface Struct {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                switch (meta.type) {
                    case 0: {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/** ${meta.name} */\n`;
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}\"${meta.jsonName}\": ${this.className(meta.element)};\n`;
                        break;
                    }
                    case 1: {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/** ${meta.name} */\n`;
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}\"${meta.jsonName}\": Array<${this.className(meta.element)}>;\n`;
                        break;
                    }
                    case 2: {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/** ${meta.name} */\n`;
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}\"${meta.jsonName}\": Table<${this.className(meta.element)}>;\n`;
                        break;
                    }
                }
            }
        }
        content += `${compile_1.T}${compile_1.T}}\n`;
        this.addContent(content);
    }
}
exports.ConfigurationTS = ConfigurationTS;
//# sourceMappingURL=configuration_ts.js.map
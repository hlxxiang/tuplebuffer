"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationCS = void 0;
const compile_1 = require("../../compiler/compile");
const cs_1 = require("../langue/cs");
class ConfigurationCS extends cs_1.CS {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    precompile(declaration) {
        let content = "using MessagePack;" +
            "\nusing System;" +
            "\nusing System.Collections.Generic;" +
            `\nnamespace Gen\n{` +
            `\n${compile_1.T}/*${declaration} */` +
            `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{`;
        this.addContent(content);
    }
    compileTypeNames(files, exportType) {
        let content = `\n${compile_1.T}${compile_1.T}public class TypeNames\n${compile_1.T}${compile_1.T}{\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${compile_1.T}${compile_1.T}${compile_1.T}/// <summary> ${meta.name} </summary>\n`;
                content += `${compile_1.T}${compile_1.T}${compile_1.T}public static string ${meta.jsonName} = \"${meta.jsonName}\";\n`;
            }
        }
        content += `${compile_1.T}${compile_1.T}}\n`;
        this.addContent(content);
    }
    compileTypes(files, exportType) {
        let content = `\n${compile_1.T}${compile_1.T}public class Types\n${compile_1.T}${compile_1.T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${compile_1.T}${compile_1.T}${compile_1.T}/// <summary> ${meta.name} </summary>\n`;
                content += `${compile_1.T}${compile_1.T}${compile_1.T}public ${this.className(meta.element)}? ${meta.jsonName};\n`;
            }
        }
        content += `\n${compile_1.T}${compile_1.T}};\n`;
        this.addContent(content);
    }
    compileStruct(files, exportType) {
        let content = `\n${compile_1.T}${compile_1.T}public class Struct\n${compile_1.T}${compile_1.T}{\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${compile_1.T}${compile_1.T}${compile_1.T}/// <summary> ${meta.name} </summary>\n`;
                switch (meta.type) {
                    case 0: {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}public ${this.className(meta.element)}? ${meta.jsonName};\n`;
                        break;
                    }
                    case 1: {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}public ${this.className(meta.element)}[]? ${meta.jsonName};\n`;
                        break;
                    }
                    case 2: {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}public Dictionary<string, ${this.className(meta.element)}>? ${meta.jsonName};\n`;
                        break;
                    }
                }
            }
        }
        content += `\n${compile_1.T}${compile_1.T}};\n`;
        this.addContent(content);
    }
}
exports.ConfigurationCS = ConfigurationCS;
//# sourceMappingURL=configuration_cs.js.map
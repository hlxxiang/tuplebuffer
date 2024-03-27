"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationCPP = void 0;
const compile_1 = require("../../compiler/compile");
const cpp_1 = require("../langue/cpp");
class ConfigurationCPP extends cpp_1.CPP {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    precompile(declaration) {
        {
            let content = `#pragma once` +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                `\n/* ${declaration} */` +
                `\nnamespace ${this.namespace} \n{` +
                `\n${compile_1.T}using int64 = int64_t;` +
                `\n${compile_1.T}using int32 = int32_t;` +
                `\n${compile_1.T}using namespace std;`;
            this.addHeadContent(content);
        }
        {
            let content = "" +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                `\n#include \"${this.fileName}.h\"\n` +
                `\n/* ${declaration} */` +
                `\nnamespace ${this.namespace} \n{` +
                `\n${compile_1.T}using namespace std;`;
            this.addSourceContent(content);
        }
    }
    compileTypeNames(files, exportType) {
        let content = `\n${compile_1.T}namespace TypeNames\n${compile_1.T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `\n${compile_1.T}${compile_1.T}/* ${meta.name} */`;
                content += `\n${compile_1.T}${compile_1.T}const string ${meta.jsonName} = \"${meta.jsonName}\";`;
            }
        }
        content += `\n${compile_1.T}};\n`;
        this.addHeadContent(content);
    }
    compileTypes(files, exportType) {
        let content = `\n${compile_1.T}namespace Types\n${compile_1.T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `\n${compile_1.T}${compile_1.T}/* ${meta.name} */`;
                content += `\n${compile_1.T}${compile_1.T}${this.className(meta.element)} ${meta.jsonName};`;
            }
        }
        content += `\n${compile_1.T}};\n`;
        this.addHeadContent(content);
    }
    compileStruct(files, exportType) {
        let content = `\n${compile_1.T}namespace Struct\n${compile_1.T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `\n${compile_1.T}${compile_1.T}/* ${meta.name} */`;
                switch (meta.type) {
                    case 0: {
                        content += `\n${compile_1.T}${compile_1.T}using ${meta.jsonName} = ${this.className(meta.element)};`;
                        break;
                    }
                    case 1: {
                        content += `\n${compile_1.T}${compile_1.T}using ${meta.jsonName} = std::vector<${this.className(meta.element)}>;`;
                        break;
                    }
                    case 2: {
                        content += `\n${compile_1.T}${compile_1.T}using ${meta.jsonName} = std::unordered_map<string, ${this.className(meta.element)}>;`;
                        break;
                    }
                }
            }
        }
        content += `\n${compile_1.T}};\n`;
        this.addHeadContent(content);
    }
}
exports.ConfigurationCPP = ConfigurationCPP;
//# sourceMappingURL=configuration_cpp.js.map
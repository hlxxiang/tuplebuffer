"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCPP = void 0;
const compile_1 = require("../../compiler/compile");
const cpp_1 = require("../langue/cpp");
class AccessCPP extends cpp_1.CPP {
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
                `\nnamespace Gen\n{` +
                `\n${compile_1.T}/* ${declaration} */` +
                `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{` +
                `\n${compile_1.T}${compile_1.T}using int64 = int64_t;` +
                `\n${compile_1.T}${compile_1.T}using int32 = int32_t;` +
                `\n${compile_1.T}${compile_1.T}using namespace std;`;
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
                `\nnamespace Gen\n{` +
                `\n${compile_1.T}/* ${declaration} */` +
                `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{` +
                `\n${compile_1.T}${compile_1.T}using namespace std;`;
            this.addSourceContent(content);
        }
    }
    compileGroupTypes(prefix, group, channelDefine) {
        let content = "";
        for (const pair of channelDefine) {
            let channels = group[pair[0]];
            content += `\n${compile_1.T}${compile_1.T}namespace ${prefix}${pair[1]}${"Names"}\n${compile_1.T}${compile_1.T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/* ${comment} */\n`;
                    }
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}const string ${record.name} = \"${record.name}\";\n`;
                }
            }
            content += `${compile_1.T}${compile_1.T}}`;
            content += `\n\n${compile_1.T}${compile_1.T}namespace ${prefix}${pair[1]}\n${compile_1.T}${compile_1.T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let meta = record.meta;
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/* ${comment} */\n`;
                    }
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}using ${record.name} = ${this.className(meta, true)};\n`;
                }
            }
            content += `${compile_1.T}${compile_1.T}};\n`;
        }
        this.addHeadContent(content);
    }
}
exports.AccessCPP = AccessCPP;
//# sourceMappingURL=access_cpp.js.map
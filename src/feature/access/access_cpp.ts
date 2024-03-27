import { T } from "../../compiler/compile";
import { CPP } from "../langue/cpp";
import { AccessBase } from "./access_base";

export class AccessCPP extends CPP implements AccessBase {
    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }
    public precompile(declaration: string): void {
        {
            let content: string = `#pragma once` +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +

                `\n/* ${declaration} */` +
                `\nnamespace ${this.namespace} \n{` +
                `\n${T}using int64 = int64_t;` +
                `\n${T}using int32 = int32_t;` +
                `\n${T}using namespace std;`;
            this.addHeadContent(content);
        }
        {
            let content: string = "" +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                `\n#include \"${this.fileName}.h\"\n` +

                `\n/* ${declaration} */` +
                `\nnamespace ${this.namespace} \n{` +
                `\n${T}using namespace std;`;
            this.addSourceContent(content);
        }
    }

    public compileGroupTypes(prefix: string, group: RecordMeta[][], channelDefine: [number, string][]): void {
        let content: string = "";
        for (const pair of channelDefine) {
            let channels: Array<RecordMeta> = group[pair[0]];

            content += `\n\n${T}namespace ${prefix}${pair[1]}${"Names"}\n${T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${T}${T}/* ${comment} */\n`;
                    }
                    content += `${T}${T}const string ${record.name} = \"${record.name}\";\n`;
                }
            }
            content += `${T}}`;

            content += `\n\n${T}namespace ${prefix}${pair[1]}\n${T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let meta = record.meta;
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${T}${T}/* ${comment} */\n`;
                    }
                    content += `${T}${T}using ${record.name} = ${this.className(meta, true)};\n`;
                }
            }
            content += `${T}};`;
        }
        this.addHeadContent(content);
    }
}
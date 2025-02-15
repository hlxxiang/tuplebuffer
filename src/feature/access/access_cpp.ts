import { T } from "../../compiler/compile";
import { CPP } from "../langue/cpp";
import { AccessBase } from "./access_base";

export class AccessCPP extends CPP implements AccessBase {

    private defineName: string

    constructor(namespace: string, path: string, fileName: string, defineName: string) {
        super(namespace, path, fileName);
        this.defineName = defineName;
    }

    public precompile(declaration: string): void {
        {
            let content: string = `#pragma once` +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using int32 = int32_t;` +
                `\n${T}${T}using uint32 = uint32_t;` +
                `\n${T}${T}using int64 = int64_t;` +
                `\n${T}${T}using uint64 = uint64_t;` +
                `\n${T}${T}using namespace std;` +
                `\n#ifdef ${this.defineName}`
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

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using namespace std;` +
                `\n#ifdef ${this.defineName}`
            this.addSourceContent(content);
        }
    }

    public compileGroupTypes(prefix: string, group: RecordMeta[][], channelDefine: [number, string][]): void {
        let content: string = "";
        for (const pair of channelDefine) {
            let channels: Array<RecordMeta> = group[pair[0]];

            content += `\n${T}${T}namespace ${prefix}${pair[1]}${"Names"}\n${T}${T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${T}${T}${T}/* ${comment} */\n`;
                    }
                    content += `${T}${T}${T}const string ${record.name} = \"${record.name}\";\n`;
                }
            }
            content += `${T}${T}}`;

            content += `\n\n${T}${T}namespace ${prefix}${pair[1]}\n${T}${T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let meta = record.meta;
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${T}${T}${T}/* ${comment} */\n`;
                    }
                    content += `${T}${T}${T}using ${record.name} = ${this.className(meta, true)};\n`;
                }
            }
            content += `${T}${T}};\n`;
        }
        this.addHeadContent(content);
    }

    public override saveFile(): void {
        this.addHeadContent(`\n#endif // ${this.defineName}`)
        this.addSourceContent(`\n#endif // ${this.defineName}`)
        super.saveFile();
    }
}
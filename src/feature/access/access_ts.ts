import { T } from "../../compiler/compile";
import { TS } from "../langue/ts";
import { AccessBase } from "./access_base";

export class AccessTS extends TS implements AccessBase {
    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }
    precompile(declaration: string): void {
        let content: string = `/*${declaration}*/` +
            "\n" +
            `declare namespace ${this.namespace} {\n`;
        this.addContent(content);
    }

    public compileGroupTypes(prefix: string, group: RecordMeta[][], channelDefine: [number, string][]): void {
        let content: string = "";
        for (const pair of channelDefine) {
            let channels: Array<RecordMeta> = group[pair[0]];

            content += `${T}const enum ${prefix}${pair[1]}${"Names"} {\n`;
            if (channels != null) {
                for (const record of channels) {
                    content += `${T}${T}${record.name} = \"${record.name}\",\n`;
                }
            }
            content += `${T}}\n\n`;

            content += `${T}interface ${prefix}${pair[1]} {\n`;
            if (channels != null) {
                for (const record of channels) {
                    let meta = record.meta;
                    content += `${T}${T}\"${record.name}\": ${this.className(meta)},\n`;
                }
            }
            content += `${T}}\n\n`;
        }
        this.addContent(content);
    }
}
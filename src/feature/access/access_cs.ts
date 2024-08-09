import { T } from "../../compiler/compile";
import { CS } from "../langue/cs";
import { AccessBase } from "./access_base";

export class AccessCS extends CS implements AccessBase {
    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }
    public precompile(declaration: string): void {
        let content: string = "using MessagePack;" +
            "\nusing System;" +
            "\nusing System.Collections.Generic;" +
            `\nnamespace Gen\n{` +
            `\n${T}/// <summary> ${declaration} </summary>` +
            `\n${T}namespace ${this.namespace}\n${T}{`;
        this.addContent(content);
    }

    public compileDeclare(indexSuffix: string, interfaceName: string, exportType: ExportType): void {
        this.addContent(`\n${T}${T}#region 自定义结构\n`);
        super.compileDeclare(indexSuffix, interfaceName, exportType);
        this.addContent(`\n${T}${T}#endregion\n`);
        this.addContent(`\n${T}${T}#region 数据库表名及表结构\n`);
    }

    public compileGroupTypes(prefix: string, group: RecordMeta[][], channelDefine: [number, string][]): void {
        let content: string = "";
        let typeContent: string = "";
        typeContent += `\n${T}${T}#region Types`
        typeContent += `\n${T}${T}namespace Types\n${T}${T}{`
        for (const pair of channelDefine) {
            let channels: Array<RecordMeta> = group[pair[0]];
            content += `\n${T}${T}#region ${prefix}${pair[1]}\n\n`
            typeContent += `\n${T}${T}${T}#region ${pair[1]}`
            content += `\n${T}${T}public class ${prefix}${pair[1]}${"Names"}\n${T}${T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${T}${T}${T}/// <summary> ${comment} </summary>\n`;
                    }
                    content += `${T}${T}${T}public const string ${record.name} = \"${record.name}\";\n`;

                    typeContent += `\n${T}${T}${T}public class ${record.name}RecordOper : RecordOper<${record.name}Record>\n${T}${T}${T}{`
                    typeContent += `\n${T}${T}${T}${T}public override string Key { get; set; } = ${pair[1]}Names.${record.name};\n${T}${T}${T}}`
                }
            }
            typeContent += `\n${T}${T}${T}#endregion\n`
            content += `${T}${T}}\n`;

            // content += `\n${T}${T}public class ${prefix}${pair[1]}\n${T}${T}{\n`;
            // if (channels != null) {
            //     for (const record of channels) {
            //         let meta = record.meta;
            //         let comment = record.comment;
            //         if (comment != null) {
            //             content += `${T}${T}${T}/// <summary> ${comment} </summary>\n`;
            //         }
            //         content += `${T}${T}${T}${this.className(meta)} ${record.name};\n`;
            //     }
            // }
            // content += `${T}${T}}\n`;
            content += `\n${T}${T}#endregion\n`
        }
        typeContent += `\n${T}${T}}`
         typeContent += `\n${T}${T}#endregion\n`
        content += typeContent;
        this.addContent(content);
    }

    public saveFile(): void {
        this.addContent(`\n${T}${T}#endregion\n`);
        super.saveFile();
    }
}
import { T } from "../../compiler/compile";
import { CS } from "../langue/cs";
import { ConfigurationBase } from "./configuration_base";

export class ConfigurationCS extends CS implements ConfigurationBase {

    private defineName: string

    constructor(namespace: string, path: string, fileName: string, defineName: string) {
        super(namespace, path, fileName);
        this.defineName = defineName;
    }

    public precompile(declaration: string): void {
        let content: string = "using MessagePack;" +
            "\nusing System;" +
            "\nusing System.Collections.Generic;" +
            `\nnamespace Gen\n{` +
            `\n${T}/// <summary> ${declaration} </summary>` +
            `\n${T}namespace ${this.namespace}\n${T}{` + 
            `\n#if ${this.defineName}`;
        this.addContent(content);
    }

    public compileDeclare(indexSuffix: string, interfaceName: string, exportType: ExportType): void {
        this.addContent(`\n${T}${T}#region 自定义结构\n`);
        super.compileDeclare(indexSuffix, interfaceName, exportType);
        this.addContent(`\n${T}${T}#endregion\n`);
        this.addContent(`\n${T}${T}#region 表名及表结构\n`);
    }

    public compileTypeNames(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}${T}public class TypeNames\n${T}${T}{\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}${T}/// <summary> ${meta.name} </summary>\n`;
                content += `${T}${T}${T}public static string ${meta.jsonName} = \"${meta.jsonName}\";\n`;
            }
        }
        content += `${T}${T}}\n`;
        this.addContent(content);
    }

    public compileTypes(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}${T}public class Types\n${T}${T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}${T}/// <summary> ${meta.name} </summary>\n`;
                content += `${T}${T}${T}public ${this.className(meta.element)} ${meta.jsonName};\n`;
            }
        }
        content += `\n${T}${T}};\n`;
        this.addContent(content);
    }

    public compileStruct(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}${T}public class Struct\n${T}${T}{\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}${T}/// <summary> ${meta.name} </summary>\n`;
                switch (meta.type) {
                    case FileType.tuple: {

                        content += `${T}${T}${T}public ${this.className(meta.element)} ${meta.jsonName};\n`;
                        break;
                    }
                    case FileType.array: {
                        content += `${T}${T}${T}public ${this.className(meta.element)}[] ${meta.jsonName};\n`;
                        break;
                    }
                    case FileType.hash: {
                        content += `${T}${T}${T}public Dictionary<string, ${this.className(meta.element)}> ${meta.jsonName};\n`;
                        break;
                    }
                }
            }
        }
        content += `${T}${T}};\n`;
        this.addContent(content);
    }

    public saveFile(): void {
        this.addContent(`\n${T}${T}#endregion`);
        this.addContent(`\n#endif`)
        super.saveFile();
    }
}
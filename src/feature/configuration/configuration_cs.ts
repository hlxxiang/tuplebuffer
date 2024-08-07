import { T } from "../../compiler/compile";
import { CS } from "../langue/cs";
import { ConfigurationBase } from "./configuration_base";

export class ConfigurationCS extends CS implements ConfigurationBase {

    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }

    public precompile(declaration: string): void {
        let content: string = "using MessagePack;" +
            "\nusing System;" +
            "\nusing System.Collections.Generic;" +
            `\nnamespace Gen\n{` +
            `\n${T}/*${declaration} */` +
            `\n${T}namespace ${this.namespace}\n${T}{`;
        this.addContent(content);
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
                content += `${T}${T}${T}public ${this.className(meta.element)}? ${meta.jsonName};\n`;
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

                        content += `${T}${T}${T}public ${this.className(meta.element)}? ${meta.jsonName};\n`;
                        break;
                    }
                    case FileType.array: {
                        content += `${T}${T}${T}public ${this.className(meta.element)}[]? ${meta.jsonName};\n`;
                        break;
                    }
                    case FileType.hash: {
                        content += `${T}${T}${T}public Dictionary<string, ${this.className(meta.element)}>? ${meta.jsonName};\n`;
                        break;
                    }
                }
            }
        }
        content += `\n${T}${T}};\n`;
        this.addContent(content);
    }
}
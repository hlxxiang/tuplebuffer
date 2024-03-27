import { T } from "../../compiler/compile";
import { CS } from "../langue/cs";
import { ConfigurationBase } from "./configuration_base";

export class ConfigurationCS extends CS implements ConfigurationBase {

    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }

    public precompile(declaration: string): void {
        let content: string = `` +
            "\nusing MessagePack;" +
            "\nusing System.Collections.Generic;" +
            `\n/// <summary> ${declaration} </summary>` +
            `\nnamespace ${this.namespace} \n{`;
        this.addContent(content);
    }

    public compileTypeNames(files: FileMeta[], exportType: ExportType): void {
        let content = `${T}public class TypeNames {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}/// <summary> ${meta.name} </summary>\n`;
                content += `${T}${T}public static string ${meta.jsonName} = \"${meta.jsonName}\";\n`;
            }
        }
        content += `${T}}\n\n`;
        this.addContent(content);
    }

    public compileTypes(files: FileMeta[], exportType: ExportType): void {
        let content = `${T}public class Types {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}/// <summary> ${meta.name} </summary>\n`;
                content += `${T}${T}public ${this.className(meta.element)}? ${meta.jsonName};\n`;
            }
        }
        content += `\n${T}};\n`;
        this.addContent(content);
    }

    public compileStruct(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}public class Struct {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}/// <summary> ${meta.name} </summary>\n`;
                switch (meta.type) {
                    case FileType.tuple: {

                        content += `${T}${T}public ${this.className(meta.element)}? ${meta.jsonName};\n`;
                        break;
                    }
                    case FileType.array: {
                        content += `${T}${T}public ${this.className(meta.element)}[]? ${meta.jsonName};\n`;
                        break;
                    }
                    case FileType.hash: {
                        content += `${T}${T}public Dictionary<string, ${this.className(meta.element)}>? ${meta.jsonName};\n`;
                        break;
                    }
                }
            }
        }
        content += `\n${T}};\n`;
        this.addContent(content);
    }
}
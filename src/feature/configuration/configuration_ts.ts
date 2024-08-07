import { T } from "../../compiler/compile";
import { TS } from "../langue/ts";
import { ConfigurationBase } from "./configuration_base";

export class ConfigurationTS extends TS implements ConfigurationBase {
    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }
    precompile(declaration: string): void {
        let content: string = `declare namespace Gen {\n` +
            `${T}/*${declaration}*/\n` +
            `${T}namespace ${this.namespace} {\n`;
        this.addContent(content);
    }

    public compileTypeNames(files: FileMeta[], exportType: ExportType): void {
        let content: string = `${T}${T}const enum StructNames {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}${T}/** ${meta.name} */\n`;
                content += `${T}${T}${T}${meta.jsonName} = \"${meta.jsonName}\",\n`;
            }
        }
        content += `${T}${T}}\n\n`;
        this.addContent(content);
    }

    public compileTypes(files: FileMeta[], exportType: ExportType): void {
        let content: string = `${T}interface Types {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `${T}${T}/** ${meta.name} */\n`;
                content += `${T}${T}\"${meta.jsonName}\": ${this.className(meta.element)};\n`;
            }
        }
        content += `${T}}\n\n`;
        this.addContent(content);
    }

    public compileStruct(files: FileMeta[], exportType: ExportType): void {
        let content: string = `${T}${T}interface Struct {\n`;
        for (const meta of files) {
            if (meta.format & exportType) {
                switch (meta.type) {
                    case FileType.tuple: {
                        content += `${T}${T}${T}/** ${meta.name} */\n`;
                        content += `${T}${T}${T}\"${meta.jsonName}\": ${this.className(meta.element)};\n`;
                        break;
                    }
                    case FileType.array: {
                        content += `${T}${T}${T}/** ${meta.name} */\n`;
                        content += `${T}${T}${T}\"${meta.jsonName}\": Array<${this.className(meta.element)}>;\n`;
                        break;
                    }
                    case FileType.hash: {
                        content += `${T}${T}${T}/** ${meta.name} */\n`;
                        content += `${T}${T}${T}\"${meta.jsonName}\": Table<${this.className(meta.element)}>;\n`;
                        break;
                    }
                }
            }
        }
        content += `${T}${T}}\n`;
        this.addContent(content);
    }
}
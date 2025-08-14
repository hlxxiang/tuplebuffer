import { T } from "../../compiler/compile";
import { CPP } from "../langue/cpp";
import { ConfigurationBase } from "./configuration_base";

export class ConfigurationCPP extends CPP implements ConfigurationBase {

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
                "\n#include <memory>" +
                "\n#include <unordered_map>\n" +
                "\n#include \"IConfiguration.h\"\n" +

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
                "\n#include <memory>" +
                "\n#include <unordered_map>\n" +
                "\n#include \"IConfiguration.h\"\n" +
                `\n#include \"${this.fileName}.h\"\n` +

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using namespace std;` +
                `\n#ifdef ${this.defineName}`
            this.addSourceContent(content);
        }
    }

    public compileTypeNames(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}${T}namespace TypeNames\n${T}${T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `\n${T}${T}${T}/* ${meta.name} */`;
                content += `\n${T}${T}${T}const string ${meta.jsonName} = \"${meta.jsonName}\";`;
            }
        }
        content += `\n${T}${T}};\n`;
        this.addHeadContent(content);
    }

    public compileTypes(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}${T}namespace Types\n${T}${T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `\n${T}${T}${T}/* ${meta.name} */`;
                content += `\n${T}${T}${T}${this.className(meta.element)} ${meta.jsonName};`;
            }
        }
        content += `\n${T}${T}};\n`;
        this.addHeadContent(content);
    }

    public compileStruct(files: FileMeta[], exportType: ExportType): void {
        let content = `\n${T}${T}namespace Struct\n${T}${T}{`;
        for (const meta of files) {
            if (meta.format & exportType) {
                content += `\n${T}${T}${T}/* ${meta.name} */`;
                switch (meta.type) {
                    case FileType.tuple: {
                        content += `\n${T}${T}${T}using ${meta.jsonName} = ${this.className(meta.element)};`;
                        break;
                    }
                    case FileType.array: {
                        content += `\n${T}${T}${T}using ${meta.jsonName} = std::vector<${this.className(meta.element)}>;`;
                        break;
                    }
                    case FileType.hash: {
                        content += `\n${T}${T}${T}using ${meta.jsonName} = std::unordered_map<string, ${this.className(meta.element)}>;`;
                        break;
                    }
                }
            }
        }
        content += `\n${T}${T}};\n`;
        this.addHeadContent(content);
    }

    public override saveFile(): void {
        this.addHeadContent(`\n#endif // ${this.defineName}`)
        this.addSourceContent(`\n#endif // ${this.defineName}`)
        super.saveFile();
    }
}
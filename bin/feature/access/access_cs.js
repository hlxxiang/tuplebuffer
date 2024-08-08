"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCS = void 0;
const compile_1 = require("../../compiler/compile");
const cs_1 = require("../langue/cs");
class AccessCS extends cs_1.CS {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    precompile(declaration) {
        let content = "using MessagePack;" +
            "\nusing System;" +
            "\nusing System.Collections.Generic;" +
            `\nnamespace Gen\n{` +
            `\n${compile_1.T}/// <summary> ${declaration} </summary>` +
            `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{`;
        this.addContent(content);
    }
    compileDeclare(indexSuffix, interfaceName, exportType) {
        this.addContent(`\n${compile_1.T}${compile_1.T}#region 自定义结构\n`);
        super.compileDeclare(indexSuffix, interfaceName, exportType);
        this.addContent(`\n${compile_1.T}${compile_1.T}#endregion\n`);
        this.addContent(`\n${compile_1.T}${compile_1.T}#region 数据库表名及表结构\n`);
    }
    compileGroupTypes(prefix, group, channelDefine) {
        let content = "";
        for (const pair of channelDefine) {
            let channels = group[pair[0]];
            content += `\n${compile_1.T}${compile_1.T}#region ${prefix}${pair[1]}\n`;
            content += `\n${compile_1.T}${compile_1.T}public class ${prefix}${pair[1]}${"Names"}\n${compile_1.T}${compile_1.T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/// <summary> ${comment} </summary>\n`;
                    }
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}public static string ${record.name} = \"${record.name}\";\n`;
                }
            }
            content += `${compile_1.T}${compile_1.T}}\n`;
            content += `\n${compile_1.T}${compile_1.T}public class ${prefix}${pair[1]}\n${compile_1.T}${compile_1.T}{\n`;
            if (channels != null) {
                for (const record of channels) {
                    let meta = record.meta;
                    let comment = record.comment;
                    if (comment != null) {
                        content += `${compile_1.T}${compile_1.T}${compile_1.T}/// <summary> ${comment} </summary>\n`;
                    }
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}${this.className(meta)} ${record.name};\n`;
                }
            }
            content += `${compile_1.T}${compile_1.T}}\n`;
            content += `\n${compile_1.T}${compile_1.T}#endregion\n`;
        }
        this.addContent(content);
    }
    saveFile() {
        this.addContent(`\n${compile_1.T}${compile_1.T}#endregion\n`);
        super.saveFile();
    }
}
exports.AccessCS = AccessCS;
//# sourceMappingURL=access_cs.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTS = void 0;
const compile_1 = require("../../compiler/compile");
const ts_1 = require("../langue/ts");
class AccessTS extends ts_1.TS {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    precompile(declaration) {
        let content = `declare namespace Gen {\n` +
            `${compile_1.T}/*${declaration}*/\n` +
            `${compile_1.T}namespace ${this.namespace} {\n`;
        this.addContent(content);
    }
    compileGroupTypes(prefix, group, channelDefine) {
        let content = "";
        for (const pair of channelDefine) {
            let channels = group[pair[0]];
            content += `${compile_1.T}${compile_1.T}const enum ${prefix}${pair[1]}${"Names"} {\n`;
            if (channels != null) {
                for (const record of channels) {
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}${record.name} = \"${record.name}\",\n`;
                }
            }
            content += `${compile_1.T}${compile_1.T}}\n\n`;
            content += `${compile_1.T}${compile_1.T}interface ${prefix}${pair[1]} {\n`;
            if (channels != null) {
                for (const record of channels) {
                    let meta = record.meta;
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}\"${record.name}\": ${this.className(meta)},\n`;
                }
            }
            content += `${compile_1.T}${compile_1.T}}\n\n`;
        }
        this.addContent(content);
    }
}
exports.AccessTS = AccessTS;
//# sourceMappingURL=access_ts.js.map
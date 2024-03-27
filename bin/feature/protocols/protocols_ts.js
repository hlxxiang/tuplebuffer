"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolsTS = void 0;
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const ts_1 = require("../langue/ts");
class ProtocolsTS extends ts_1.TS {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    init(maxOpcode, channelLimit, commandSuffix) {
        this.maxOpcode = maxOpcode;
        this.channelLimit = channelLimit;
        this.commandSuffix = commandSuffix;
    }
    precompile(declaration) {
        let content = `/*${declaration}*/` +
            "\n" +
            `declare namespace ${this.namespace} {\n`;
        this.addContent(content);
    }
    compileEnum(name, elements) {
        let content = "";
        content = `${compile_1.T}const enum ${name} {`;
        for (const pair of elements) {
            content += `\n${compile_1.T}${compile_1.T}` + `${pair[1]} = 0x${pair[0].toString(16)},`;
        }
        content += `\n${compile_1.T}}\n\n`;
        this.addContent(content);
    }
    compileGroups(groups, groupDefines, channelDefine) {
        let content = "";
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `${compile_1.T}/***************************************${v[1]}命令***************************************/\n\n`;
            content += this.compileGroup(v[1], list, channelDefine);
        }
        this.addContent(content);
    }
    compileGroup(name, group, channelDefine) {
        let content = "";
        let c2s_result = "";
        let s2c_result = "";
        let s2s_result = "";
        for (const pair of channelDefine) {
            let channels = group[pair[0]];
            if (channels == null) {
                continue;
            }
            if (name == "Client") {
                c2s_result += this.compileCommand(channels, name, pair[1]);
            }
            else if (pair[1] == "Client") {
                s2c_result += this.compileCommand(channels, name, pair[1]);
            }
            else {
                s2s_result += this.compileCommand_s2s(channels, name, pair[1]);
            }
        }
        content += `${compile_1.T}const enum ${this.commandSuffix} {\n`;
        if (c2s_result.length > 0) {
            content += c2s_result;
        }
        if (s2c_result.length > 0) {
            content += s2c_result;
        }
        content += `${compile_1.T}}\n\n`;
        content += s2s_result;
        return content;
    }
    compileCommand(channels, group, type) {
        let content = "";
        for (let segment of channels) {
            let base = segment[0];
            for (let i = 0, size = segment[1].length; i < size; ++i) {
                let meta = segment[1][i];
                if (i >= base[1]) {
                    log_1.Log.instance.error(`协议：(${meta.name}) 注释：(${meta.comment})`);
                    throw new Error("超过当前段上限");
                }
                if ((base[0] + i) >= this.channelLimit) {
                    log_1.Log.instance.error(`协议：(${meta.name}) 注释：(${meta.comment})`);
                    throw new Error("超过频道上限");
                }
                let opcode = meta.group | meta.channel | (base[0] + i);
                if (opcode > this.maxOpcode) {
                    log_1.Log.instance.error(`协议：(${meta.name}) 注释：(${meta.comment})`);
                    log_1.Log.instance.error(`opcode(${opcode}) max(${this.maxOpcode})`);
                    throw new Error("协议号超上限");
                }
                if (meta.comment != null) {
                    content += `${compile_1.T}${compile_1.T}/** ${meta.comment} */\n`;
                }
                content += `${compile_1.T}${compile_1.T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
            content += `\n`;
        }
        return content;
    }
    compileCommand_s2s(channels, group, type) {
        let first = "S";
        let second = "S";
        if (group == "System") {
            first = "S";
            second = type;
        }
        else if (type == "System") {
            first = group;
            second = "S";
        }
        else {
            first = group;
            second = type;
        }
        let content = `${compile_1.T}const enum ${first}${second}${this.commandSuffix} {\n`;
        for (let segment of channels) {
            let base = segment[0];
            for (let i = 0, size = segment[1].length; i < size; ++i) {
                let meta = segment[1][i];
                if (i >= base[1]) {
                    log_1.Log.instance.error(`超过当前段上限`);
                    throw new Error("超过当前段上限");
                }
                if ((base[0] + i) >= this.channelLimit) {
                    log_1.Log.instance.error(`超过频道上限`);
                    throw new Error("超过频道上限");
                }
                let opcode = meta.group | meta.channel | (base[0] + i);
                if (opcode > this.maxOpcode) {
                    log_1.Log.instance.error(`opcode(${opcode}) max(${this.maxOpcode})`);
                    throw new Error("协议号超上限");
                }
                if (meta.comment != null) {
                    content += `${compile_1.T}${compile_1.T}/** ${meta.comment} */\n`;
                }
                content += `${compile_1.T}${compile_1.T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
        }
        content += `${compile_1.T}}\n\n`;
        return content;
    }
    compileTypes(typesName, groups, groupDefines, channelDefine) {
        let content = "";
        let result = `${compile_1.T}/***************************************命令类型***************************************/\n\n`;
        result += `${compile_1.T}interface ${typesName} {\n`;
        for (const v of groupDefines) {
            let list = groups[v[0]];
            result += `${compile_1.T}/***************************************${v[1]}命令***************************************/\n\n`;
            result += this.compileGroupTypes(v[1], list, channelDefine);
        }
        content += `${compile_1.T}\n`;
        this.addContent(content);
    }
    compileGroupTypes(name, group, channelDefine) {
        let content = "";
        let first = "C";
        let second = "S";
        for (const pair of channelDefine) {
            let channels = group[pair[0]];
            if (channels != null) {
                if (name == "Client") {
                    first = "";
                    second = "";
                }
                else if (pair[1] == "Client") {
                    first = "";
                    second = "";
                }
                else {
                    if (name == "System") {
                        first = "S";
                        second = pair[1];
                    }
                    else if (pair[1] == "System") {
                        first = name;
                        second = "S";
                    }
                    else {
                        first = name;
                        second = pair[1];
                    }
                }
                for (let segment of channels) {
                    for (let i = 0, size = segment[1].length; i < size; ++i) {
                        let meta = segment[1][i];
                        if (meta.metaRpc) {
                            content += `${compile_1.T}${compile_1.T}[${first}${second}${this.commandSuffix}.${this.className(meta.meta)}]: [${this.className(meta.meta)}, ${this.className(meta.metaRpc)}],\n`;
                        }
                        else {
                            content += `${compile_1.T}${compile_1.T}[${first}${second}${this.commandSuffix}.${this.className(meta.meta)}]: [${this.className(meta.meta)}],\n`;
                        }
                    }
                }
                content += `\n`;
            }
        }
        return content;
    }
}
exports.ProtocolsTS = ProtocolsTS;
//# sourceMappingURL=protocols_ts.js.map
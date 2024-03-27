"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolsCS = void 0;
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const cs_1 = require("../langue/cs");
class ProtocolsCS extends cs_1.CS {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    init(maxOpcode, channelLimit, commandSuffix) {
        this.maxOpcode = maxOpcode;
        this.channelLimit = channelLimit;
        this.commandSuffix = commandSuffix;
    }
    precompile(declaration) {
        let content = `` +
            "\nusing MessagePack;" +
            "\nusing System.Collections.Generic;" +
            `\n/* ${declaration} */` +
            `\nnamespace ${this.namespace}\n{`;
        this.addContent(content);
    }
    compileEnum(name, elements) {
        let content = "";
        if (elements.length == 0) {
            content = "";
        }
        else {
            content += `\n${compile_1.T}public enum ${name} \n${compile_1.T}{`;
            for (const pair of elements) {
                if (pair[2] && "" != pair[2]) {
                    content += `\n${compile_1.T}${compile_1.T}/// <summary>${pair[2]}</summary>`;
                }
                content += `\n${compile_1.T}${compile_1.T}` + `${pair[1]} = 0x${pair[0].toString(16)},`;
            }
            content += `\n${compile_1.T}}\n`;
        }
        this.addContent(content);
    }
    compileGroups(groups, groupDefines, channelDefine) {
        let content = "";
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${compile_1.T}/// <summary>   ${v[1]}命令   </summary>\n`;
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
        content += `\n${compile_1.T}public enum ${name}${this.commandSuffix} {`;
        if (c2s_result.length > 0) {
            content += c2s_result;
        }
        if (s2c_result.length > 0) {
            content += s2c_result;
        }
        content += `\n${compile_1.T}}`;
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
                    content += `\n${compile_1.T}${compile_1.T}/// <summary> ${meta.comment} </summary>`;
                }
                content += `\n${compile_1.T}${compile_1.T}${meta.name} = 0x${opcode.toString(16)},`;
            }
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
        let content = `\n\tpublic enum ${first}${second}${this.commandSuffix}\n{`;
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
                    content += `\n${compile_1.T}${compile_1.T}/// <summary> ${meta.comment} </summary>`;
                }
                content += `\n${compile_1.T}${compile_1.T}${meta.name} = 0x${opcode.toString(16)},`;
            }
        }
        content += `\n${compile_1.T}};`;
        return content;
    }
    compileTypes(typesName, groups, groupDefines, channelDefine) {
        let content = `\n\n${compile_1.T}/// <summary>${compile_1.T}命令类型${compile_1.T}</summary>`;
        content += `\n${compile_1.T}namespace ${typesName}`;
        content += `\n${compile_1.T}{`;
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${compile_1.T}${compile_1.T}/// <summary> ${v[1]}命令 </summary>`;
            content += this.compileGroupTypes(v[1], list, channelDefine);
        }
        content += `\n${compile_1.T}}`;
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
                            if (meta.metaRpc.comment) {
                                content += `\n${compile_1.T}${compile_1.T}/// <summary> ${meta.metaRpc.comment} </summary>`;
                            }
                            content += `\n${compile_1.T}${compile_1.T}using ${this.className(meta.meta)} = Tuple<${this.className(meta.meta)}, ${this.className(meta.metaRpc)}>;`;
                        }
                        else {
                            if (meta.meta.comment) {
                                content += `\n${compile_1.T}${compile_1.T}/// <summary> ${meta.meta.comment} </summary>`;
                            }
                            content += `\n${compile_1.T}${compile_1.T}using ${this.className(meta.meta)} = Tuple<${this.className(meta.meta)}>;`;
                        }
                    }
                }
            }
        }
        return content;
    }
}
exports.ProtocolsCS = ProtocolsCS;
//# sourceMappingURL=protocols_cs.js.map
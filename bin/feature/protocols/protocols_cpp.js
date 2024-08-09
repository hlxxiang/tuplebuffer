"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolsCpp = void 0;
const compile_1 = require("../../compiler/compile");
const log_1 = require("../../utils/log");
const cpp_1 = require("../langue/cpp");
class ProtocolsCpp extends cpp_1.CPP {
    constructor(namespace, path, fileName) {
        super(namespace, path, fileName);
    }
    init(maxOpcode, channelLimit, commandSuffix) {
        this.maxOpcode = maxOpcode;
        this.channelLimit = channelLimit;
        this.commandSuffix = commandSuffix;
    }
    precompile(declaration) {
        {
            let content = `#pragma once` +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                `\nnamespace Gen\n{` +
                `\n${compile_1.T}/* ${declaration} */` +
                `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{` +
                `\n${compile_1.T}${compile_1.T}using int32 = int32_t;` +
                `\n${compile_1.T}${compile_1.T}using uint32 = uint32_t;` +
                `\n${compile_1.T}${compile_1.T}using int64 = int64_t;` +
                `\n${compile_1.T}${compile_1.T}using uint64 = uint64_t;` +
                `\n${compile_1.T}${compile_1.T}using namespace std;`;
            this.addHeadContent(content);
        }
        {
            let content = "" +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                `\n#include \"${this.fileName}.h\"\n` +
                `\nnamespace Gen\n{` +
                `\n${compile_1.T}/* ${declaration} */` +
                `\n${compile_1.T}namespace ${this.namespace}\n${compile_1.T}{` +
                `\n${compile_1.T}${compile_1.T}using namespace std;`;
            this.addSourceContent(content);
        }
    }
    compileEnum(name, elements) {
        let content = "";
        if (elements.length == 0) {
            content = "";
        }
        else {
            content = `\n${compile_1.T}${compile_1.T}enum class ${name}\n${compile_1.T}${compile_1.T}{`;
            for (const pair of elements) {
                if (pair[2] && "" != pair[2]) {
                    content += `\n${compile_1.T}${compile_1.T}${compile_1.T}/* ${pair[2]} */`;
                }
                content += `\n${compile_1.T}${compile_1.T}${compile_1.T}` + `${pair[1]} = 0x${pair[0].toString(16)},`;
            }
            content += `\n${compile_1.T}${compile_1.T}};`;
        }
        this.addHeadContent(content);
    }
    compileGroups(groups, groupDefines, channelDefine) {
        let content = "";
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${compile_1.T}${compile_1.T}/* ${v[1]} 协议命令 */\n`;
            content += this.compileGroup(v[1], list, channelDefine);
        }
        this.addHeadContent(content);
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
        content += `${compile_1.T}${compile_1.T}enum class ${name}${this.commandSuffix}\n${compile_1.T}${compile_1.T}{\n`;
        if (c2s_result.length > 0) {
            content += c2s_result;
        }
        if (s2c_result.length > 0) {
            content += s2c_result;
        }
        content += `${compile_1.T}${compile_1.T}};\n`;
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
                    content += `${compile_1.T}${compile_1.T}${compile_1.T}/* ${meta.comment} */\n`;
                }
                content += `${compile_1.T}${compile_1.T}${compile_1.T}${meta.name} = 0x${opcode.toString(16)},\n`;
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
        let content = `\n${compile_1.T}${compile_1.T}enum class ${first}${second}${this.commandSuffix}\n${compile_1.T}${compile_1.T}{\n`;
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
                    content += `${compile_1.T}${compile_1.T}/* ${meta.comment} */\n`;
                }
                content += `${compile_1.T}${compile_1.T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
        }
        content += `${compile_1.T}};`;
        return content;
    }
    compileTypes(typesName, groups, groupDefines, channelDefine) {
        let content = `\n\n${compile_1.T}${compile_1.T}/* 协议及结构 */`;
        content += `\n${compile_1.T}${compile_1.T}namespace ${typesName}`;
        content += `\n${compile_1.T}${compile_1.T}{`;
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${compile_1.T}${compile_1.T}${compile_1.T}/* ${v[1]} 协议结构 */`;
            content += this.compileGroupTypes(v[1], list, channelDefine);
            content += `\n${compile_1.T}${compile_1.T}${compile_1.T}/* ${v[1]} 协议结构 */\n`;
        }
        content += `${compile_1.T}${compile_1.T}}\n`;
        this.addHeadContent(content);
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
                                content += `\n${compile_1.T}${compile_1.T}${compile_1.T}/* ${meta.metaRpc.comment} */`;
                            }
                            content += `\n${compile_1.T}${compile_1.T}${compile_1.T}using ${this.className(meta.meta)} = std::tuple<${this.className(meta.meta)}, ${this.className(meta.metaRpc)}>;`;
                        }
                        else {
                            if (meta.meta.comment) {
                                content += `\n${compile_1.T}${compile_1.T}${compile_1.T}/* ${meta.meta.comment} */`;
                            }
                            content += `\n${compile_1.T}${compile_1.T}${compile_1.T}using ${this.className(meta.meta)} = std::tuple<${this.className(meta.meta)}>;`;
                        }
                    }
                }
            }
        }
        return content;
    }
}
exports.ProtocolsCpp = ProtocolsCpp;
//# sourceMappingURL=protocols_cpp.js.map
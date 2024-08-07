import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { CPP } from "../langue/cpp";
import { ProtocolsBase } from "./protocols_base";

export class ProtocolsCpp extends CPP implements ProtocolsBase {
    protected maxOpcode: number;
    protected channelLimit: number;
    protected commandSuffix: string;

    constructor(namespace: string, path: string, fileName: string) {
        super(namespace, path, fileName);
    }

    init(maxOpcode: number, channelLimit: number, commandSuffix: string): void {
        this.maxOpcode = maxOpcode;
        this.channelLimit = channelLimit;
        this.commandSuffix = commandSuffix;
    }

    public precompile(declaration: string): void {
        {
            let content: string = `#pragma once` +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using int64 = int64_t;` +
                `\n${T}${T}using int32 = int32_t;` +
                `\n${T}${T}using namespace std;`;
            this.addHeadContent(content);
        }
        {
            let content: string = "" +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                `\n#include \"${this.fileName}.h\"\n` +

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using namespace std;`;
            this.addSourceContent(content);
        }
    }

    public compileEnum(name: string, elements: [number, string, string][]): void {
        let content: string = "";
        if (elements.length == 0) {
            content = "";
        }
        else {
            content = `\n${T}${T}enum class ${name}\n${T}${T}{`;
            for (const pair of elements) {
                if (pair[2] && "" != pair[2]) {
                    content += `\n${T}${T}${T}/* ${pair[2]} */`;
                }
                content += `\n${T}${T}${T}` + `${pair[1]} = 0x${pair[0].toString(16)},`;
            }
            content += `\n${T}${T}};`;
        }
        this.addHeadContent(content);
    }

    public compileGroups(groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void {
        let content: string = "";
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${T}${T}/* ${v[1]}命令 */\n`;
            content += this.compileGroup(v[1], list, channelDefine);
        }
        this.addHeadContent(content);
    }

    private compileGroup(name: string, group: ProtocolGroup, channelDefine: [number, string, string][]): string {
        let content = "";
        let c2s_result = "";
        let s2c_result = "";
        let s2s_result = ""
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
        content += `${T}${T}enum class ${name}${this.commandSuffix}\n${T}${T}{\n`;
        if (c2s_result.length > 0) {
            content += c2s_result;
        }
        if (s2c_result.length > 0) {
            content += s2c_result;
        }
        content += `${T}${T}};\n`;
        content += s2s_result;
        return content;
    }

    private compileCommand(channels: ProtocolChannel, group: string, type: string): string {
        let content: string = "";
        for (let segment of channels) {
            let base = segment[0];
            for (let i = 0, size = segment[1].length; i < size; ++i) {
                let meta = segment[1][i];
                if (i >= base[1]) {
                    Log.instance.error(`超过当前段上限`);
                    throw new Error("超过当前段上限");
                }

                if ((base[0] + i) >= this.channelLimit) {
                    Log.instance.error(`超过频道上限`);
                    throw new Error("超过频道上限");
                }

                let opcode = meta.group | meta.channel | (base[0] + i);
                if (opcode > this.maxOpcode) {
                    Log.instance.error(`opcode(${opcode}) max(${this.maxOpcode})`)
                    throw new Error("协议号超上限");
                }
                if (meta.comment != null) {
                    content += `${T}${T}${T}/* ${meta.comment} */\n`;
                }
                content += `${T}${T}${T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
        }
        return content;
    }

    private compileCommand_s2s(channels: ProtocolChannel, group: string, type: string): string {
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
        let content: string = `\n${T}${T}enum class ${first}${second}${this.commandSuffix}\n${T}${T}{\n`;
        for (let segment of channels) {
            let base = segment[0];
            for (let i = 0, size = segment[1].length; i < size; ++i) {
                let meta = segment[1][i];
                if (i >= base[1]) {
                    Log.instance.error(`超过当前段上限`);
                    throw new Error("超过当前段上限");
                }

                if ((base[0] + i) >= this.channelLimit) {
                    Log.instance.error(`超过频道上限`);
                    throw new Error("超过频道上限");
                }

                let opcode = meta.group | meta.channel | (base[0] + i);
                if (opcode > this.maxOpcode) {
                    Log.instance.error(`opcode(${opcode}) max(${this.maxOpcode})`)
                    throw new Error("协议号超上限");
                }
                if (meta.comment != null) {
                    content += `${T}${T}/* ${meta.comment} */\n`;
                }
                content += `${T}${T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
        }
        content += `${T}};`;
        return content;
    }

    public compileTypes(typesName: string, groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void {
        let content: string = `\n\n${T}${T}/*${T}命令类型${T}*/`;
        content += `\n${T}${T}namespace ${typesName}`;
        content += `\n${T}${T}{`
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${T}${T}${T}/* ${v[1]}命令 */`;
            content += this.compileGroupTypes(v[1], list, channelDefine);
        }
        content += `\n${T}${T}}\n`;
        this.addHeadContent(content);
    }

    private compileGroupTypes(name: string, group: ProtocolGroup, channelDefine: [number, string, string][]): string {
        let content: string = "";
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
                // result += `${T}${T}//${first}${Second}${this._commandSuffix}\n`;
                for (let segment of channels) {
                    for (let i = 0, size = segment[1].length; i < size; ++i) {
                        let meta = segment[1][i];
                        // if (meta.metaRpc) {
                        //     result += `\n${T}${T}${T}[${first}${second}${this.commandSuffix}.${this.className(meta.meta)}]: [${this.className(meta.meta)}, ${this.className(meta.metaRpc)}],`;
                        // }
                        // else {
                        //     result += `\n${T}${T}${T}[${first}${second}${this.commandSuffix}.${this.className(meta.meta)}]: [${this.className(meta.meta)}],`;
                        // }
                        if (meta.metaRpc) {
                            if (meta.metaRpc.comment) {
                                content += `\n${T}${T}${T}/* ${meta.metaRpc.comment} */`;
                            }
                            content += `\n${T}${T}${T}using ${this.className(meta.meta)} = std::tuple<${this.className(meta.meta)}, ${this.className(meta.metaRpc)}>;`;
                        }
                        else {
                            if (meta.meta.comment) {
                                content += `\n${T}${T}${T}/* ${meta.meta.comment} */`;
                            }
                            content += `\n${T}${T}${T}using ${this.className(meta.meta)} = std::tuple<${this.className(meta.meta)}>;`;
                        }
                    }
                }
            }
        }
        return content;
    }
}
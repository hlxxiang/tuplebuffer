import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { TS } from "../langue/ts";
import { ProtocolsBase } from "./protocols_base";

export class ProtocolsTS extends TS implements ProtocolsBase {
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
        let content: string = `/*${declaration}*/\n` +
            `declare namespace Gen {\n` +
            `${T}namespace ${this.namespace} {\n`;
        this.addContent(content);
    }

    public compileEnum(name: string, elements: [number, string, string][]): void {
        let content: string = "";
        content = `${T}${T}const enum ${name} {`;
        for (const pair of elements) {
            content += `\n${T}${T}${T}${T}` + `${pair[1]} = 0x${pair[0].toString(16)},`;
        }
        content += `\n${T}${T}${T}}\n\n`;
        this.addContent(content);
    }

    public compileGroups(groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void {
        let content: string = "";
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `${T}${T}/***************************************${v[1]}命令***************************************/\n\n`;
            content += this.compileGroup(v[1], list, channelDefine);
        }
        this.addContent(content);
    }

    private compileGroup(name: string, group: ProtocolGroup, channelDefine: [number, string, string][]): string {
        let content: string = "";
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
        content += `${T}${T}const enum ${this.commandSuffix} {\n`;
        if (c2s_result.length > 0) {
            content += c2s_result;
        }
        if (s2c_result.length > 0) {
            content += s2c_result;
        }
        content += `${T}${T}}\n\n`;
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
                    Log.instance.error(`协议：(${meta.name}) 注释：(${meta.comment})`);
                    throw new Error("超过当前段上限");
                }

                if ((base[0] + i) >= this.channelLimit) {
                    Log.instance.error(`协议：(${meta.name}) 注释：(${meta.comment})`);
                    throw new Error("超过频道上限");
                }

                let opcode = meta.group | meta.channel | (base[0] + i);
                if (opcode > this.maxOpcode) {
                    Log.instance.error(`协议：(${meta.name}) 注释：(${meta.comment})`);
                    Log.instance.error(`opcode(${opcode}) max(${this.maxOpcode})`)
                    throw new Error("协议号超上限");
                }
                if (meta.comment != null) {
                    content += `${T}${T}${T}/** ${meta.comment} */\n`
                }
                content += `${T}${T}${T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
            content += `\n`;
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
        let content: string = `${T}${T}const enum ${first}${second}${this.commandSuffix} {\n`;
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
                    content += `${T}${T}${T}/** ${meta.comment} */\n`
                }
                content += `${T}${T}${T}${meta.name} = 0x${opcode.toString(16)},\n`;
            }
        }
        content += `${T}${T}}\n\n`;
        return content;
    }


    public compileTypes(typesName: string, groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void {
        let content: string = "";
        let result: string = `${T}${T}/***************************************命令类型***************************************/\n\n`;
        result += `${T}${T}interface ${typesName} {\n`;
        for (const v of groupDefines) {
            let list = groups[v[0]];
            result += `${T}${T}/***************************************${v[1]}命令***************************************/\n\n`;
            result += this.compileGroupTypes(v[1], list, channelDefine);
        }
        content += result + `${T}${T}\n`;
        this.addContent(content);
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
                for (let segment of channels) {
                    for (let i = 0, size = segment[1].length; i < size; ++i) {
                        let meta = segment[1][i];
                        if (meta.metaRpc) {
                            content += `${T}${T}${T}[${first}${second}${this.commandSuffix}.${this.className(meta.meta)}]: [${this.className(meta.meta)}, ${this.className(meta.metaRpc)}],\n`;
                        }
                        else {
                            content += `${T}${T}${T}[${first}${second}${this.commandSuffix}.${this.className(meta.meta)}]: [${this.className(meta.meta)}],\n`;
                        }
                    }
                }
                content += `\n`;
            }
        }
        return content;
    }
}
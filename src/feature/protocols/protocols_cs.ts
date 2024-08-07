import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { CS } from "../langue/cs";
import { ProtocolsBase } from "./protocols_base";

export class ProtocolsCS extends CS implements ProtocolsBase {
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
        let content: string = "using MessagePack;" +
            "\nusing System;" +
            "\nusing System.Collections.Generic;" +
            `\nnamespace Gen\n{` +
            `\n/*${T}${declaration} */` +
            `\n${T}namespace ${this.namespace}\n${T}{`;
        this.addContent(content);
    }

    public compileEnum(name: string, elements: [number, string, string][]): void {
        let content: string = "";
        if (elements.length == 0) {
            content = "";
        }
        else {
            content += `\n${T}${T}public enum ${name} \n${T}${T}{`;
            for (const pair of elements) {
                if (pair[2] && "" != pair[2]) {
                    content += `\n${T}${T}${T}/// <summary>${pair[2]}</summary>`;
                }
                content += `\n${T}${T}${T}` + `${pair[1]} = 0x${pair[0].toString(16)},`;
            }
            content += `\n${T}${T}}\n`;
        }

        this.addContent(content);
    }

    public compileGroups(groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void {
        let content: string = "";
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${T}${T}/// <summary>   ${v[1]}命令   </summary>\n`;
            content += this.compileGroup(v[1], list, channelDefine);
        }
        this.addContent(content);
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
            // content += this.compileProtocol(channels, name, pair[1]);
        }
        content += `\n${T}${T}public enum ${name}${this.commandSuffix}\n${T}${T}{`;
        if (c2s_result.length > 0) {
            content += c2s_result;
        }
        if (s2c_result.length > 0) {
            content += s2c_result;
        }
        content += `\n${T}${T}}`;
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
                    content += `\n${T}${T}${T}/// <summary> ${meta.comment} </summary>`;
                }
                content += `\n${T}${T}${T}${meta.name} = 0x${opcode.toString(16)},`;
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
        let content: string = `\n\tpublic enum ${first}${second}${this.commandSuffix}\n${T}${T}{`;
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
                    content += `\n${T}${T}${T}/// <summary> ${meta.comment} </summary>`;
                }
                content += `\n${T}${T}${T}${meta.name} = 0x${opcode.toString(16)}`;
            }
        }
        content += `\n${T}${T};`;
        return content;
    }


    public compileTypes(typesName: string, groups: ProtocolGroup[], groupDefines: [number, string, string][], channelDefine: [number, string, string][]): void {
        let content: string = `\n\n${T}${T}/// <summary>${T}命令类型${T}</summary>`;
        content += `\n${T}${T}namespace ${typesName}`;
        content += `\n${T}${T}{`
        for (const v of groupDefines) {
            let list = groups[v[0]];
            content += `\n${T}${T}${T}/// <summary> ${v[1]}命令 </summary>`;
            content += this.compileGroupTypes(v[1], list, channelDefine);
        }
        content += `\n${T}${T}}`;
        content += `\n${T}}`;
        this.addContent(content);
    }

    private compileGroupTypes(name: string, group: ProtocolGroup, channelDefine: [number, string, string][]): string {
        let content: string = "";
        for (const pair of channelDefine) {
            let channels = group[pair[0]];
            if (channels != null) {
                for (let segment of channels) {
                    for (let i = 0, size = segment[1].length; i < size; ++i) {
                        let meta = segment[1][i];
                        // if (meta.metaRpc) {
                        //     if (meta.metaRpc.comment) {
                        //         content += `\n${T}${T}${T}/// <summary> ${meta.metaRpc.comment} </summary>`;
                        //     }
                        //     content += `\n${T}${T}${T}using ${this.className(meta.meta)} = Tuple<${this.className(meta.meta)}, ${this.className(meta.metaRpc)}>;`;
                        // }
                        // else {
                        //     if (meta.meta.comment) {
                        //         content += `\n${T}${T}${T}/// <summary> ${meta.meta.comment} </summary>`;
                        //     }
                        //     content += `\n${T}${T}${T}using ${this.className(meta.meta)} = Tuple<${this.className(meta.meta)}>;`;
                        // }

                        if (meta.metaRpc) {
                            if (meta.metaRpc.comment) {
                                content += `\n${T}${T}${T}/// <summary> ${meta.metaRpc.comment} </summary>`;
                            }
                            content += `\n${T}${T}${T}public class ${this.className(meta.meta)}Oper : Call<${this.className(meta.meta)}, ${this.className(meta.metaRpc)}, ${name}${this.commandSuffix}>`;
                            content += `\n${T}${T}${T}{`;
                            content += `\n${T}${T}${T}${T}public const ${name}${this.commandSuffix} Opcode = ${name}${this.commandSuffix}.${this.className(meta.meta)};`;
                            content += `\n${T}${T}${T}}`;
                        }
                        else {
                            if (meta.meta.comment) {
                                content += `\n${T}${T}${T}/// <summary> ${meta.meta.comment} </summary>`;
                            }
                            content += `\n${T}${T}${T}public class ${this.className(meta.meta)}Oper : Send<${this.className(meta.meta)}, ${name}${this.commandSuffix}>`;
                            content += `\n${T}${T}${T}{`;
                            content += `\n${T}${T}${T}${T}public const ${name}${this.commandSuffix} Opcode = ${name}${this.commandSuffix}.${this.className(meta.meta)};`;
                            content += `\n${T}${T}${T}}`;
                        }
                    }
                }
            }
        }
        return content;
    }
}
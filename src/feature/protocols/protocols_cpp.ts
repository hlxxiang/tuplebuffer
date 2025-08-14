import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { CPP } from "../langue/cpp";
import { GroupOpcodeNames, ProtocolsBase } from "./protocols_base";

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
                "\n#include <memory>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                "\n#include \"IProtocols.h\"\n" +

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using int32 = int32_t;` +
                `\n${T}${T}using uint32 = uint32_t;` +
                `\n${T}${T}using int64 = int64_t;` +
                `\n${T}${T}using uint64 = uint64_t;` +
                `\n${T}${T}using namespace std;\n`;
            this.addHeadContent(content);
        }
        {
            let content: string = "" +
                "\n#include <tuple>" +
                "\n#include <string>" +
                "\n#include <vector>" +
                "\n#include <memory>" +
                "\n#include <optional>" +
                "\n#include <unordered_map>\n" +
                "\n#include \"IProtocols.h\"\n" +
                `\n#include \"${this.fileName}.h\"\n` +

                `\nnamespace Gen\n{` +
                `\n${T}/* ${declaration} */` +
                `\n${T}namespace ${this.namespace}\n${T}{` +
                `\n${T}${T}using namespace std;\n`;
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
            content += `\n${T}${T}};\n`;
        }
        this.addHeadContent(content);
    }

    public compileGroups(groups: Map<GroupType, ProtocolGroup>, groupDefines: [number, string, string][]): void {
        let content: string = "";
        for (const v of groupDefines) {
            const groupType = v[0];
            const groupName = v[1];
            let group = groups.get(groupType);
            content += this.compileGroup(groupType, groupName, group);
        }
        this.addHeadContent(content);
    }

    private compileGroup(groupType: GroupType, groupName: string, group: ProtocolGroup): string {
        let content = "";
        let to_c_result = "";
        let to_s_result = "";
        let to_b_result = "";
        for (const groupChannel of group) {
            for (const channel of groupChannel[1]) {
                if (channel[0][3] == ServerType.Client) {
                    to_c_result += this.compileCommand(groupType, groupName, channel);
                }
                else if (channel[0][3] == ServerType.BG) {
                    to_b_result += this.compileCommand(groupType, groupName, channel);
                }
                else {
                    to_s_result += this.compileCommand(groupType, groupName, channel);
                }
            }
        }
        if (to_c_result.length > 0) {
            content += `\n${T}${T}/* ${GroupOpcodeNames[groupType]} to ${GroupOpcodeNames[GroupType.Client]} 协议命令 */`;
            content += `\n${T}${T}enum class ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[GroupType.Client]}${this.commandSuffix}\n${T}${T}{`;
            content += to_c_result;
            content += `\n${T}${T}};`;
        }
        if (to_s_result.length > 0) {
            content += `\n${T}${T}/* ${GroupOpcodeNames[groupType]} to ${GroupOpcodeNames[GroupType.System]} 协议命令 */`;
            content += `\n${T}${T}enum class ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[GroupType.System]}${this.commandSuffix}\n${T}${T}{`;
            content += to_s_result;
            content += `\n${T}${T}};\n`;
        }
        if (to_b_result.length > 0) {
            content += `\n${T}${T}/* ${GroupOpcodeNames[groupType]} to ${GroupOpcodeNames[GroupType.BG]} 协议命令 */`;
            content += `\n${T}${T}enum class ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[GroupType.BG]}${this.commandSuffix}\n${T}${T}{`;
            content += to_b_result;
            content += `\n${T}${T}};\n`;
        }
        return content;
    }

    private compileCommand(groupType: GroupType, groupName: string, channel: ProtocolChannel): string {
        let content: string = ``;
        let base = channel[0];
        for (let i = 0; i < channel[1].length; i++) {
            const meta = channel[1][i];
            if (i >= base[1]) {
                Log.instance.error(`超过当前段上限`);
                throw new Error("超过当前段上限");
            }

            if ((base[0] + i) >= this.channelLimit) {
                Log.instance.error(`超过频道上限`);
                throw new Error("超过频道上限");
            }
            let opcode = meta.source << BitMask.GroupType | meta.target << BitMask.ServerType | (base[0] + i);
            if (opcode > this.maxOpcode) {
                Log.instance.error(`opcode(${opcode}) max(${this.maxOpcode})`)
                throw new Error("协议号超上限");
            }
            if (meta.comment != null) {
                content += `\n${T}${T}${T}/* ${meta.comment} */`;
            }
            content += `\n${T}${T}${T}${meta.name} = 0x${opcode.toString(16)},`;
        }
        return content;
    }

    public compileTypes(typesName: string, groups: Map<GroupType, ProtocolGroup>, groupDefines: [number, string, string][]): void {
        let content: string = "";
        for (const v of groupDefines) {
            const groupType = v[0];
            const groupName = v[1];
            let group = groups.get(groupType);
            content += this.compileGroupTypes(typesName, groupType, groupName, group);
        }
        content += `\n`;
        this.addHeadContent(content);
    }

    private compileGroupTypes(typesName: string, groupType: GroupType, groupName: string, group: ProtocolGroup): string {
        let content: string = "";
        let to_c_result = "";
        let to_s_result = "";
        let to_b_result = "";
        for (const groupChannel of group) {
            for (const channel of groupChannel[1]) {
                if (channel[0][3] == ServerType.Client) {
                    to_c_result += this.compileGroupType(groupType, groupName, channel);
                }
                else if (channel[0][3] == ServerType.BG) {
                     to_b_result += this.compileGroupType(groupType, groupName, channel);
                }
                else {
                    to_s_result += this.compileGroupType(groupType, groupName, channel);
                }
            }
        }
        if (to_c_result.length > 0) {
            content += `\n${T}${T}/* ${GroupOpcodeNames[groupType]} to ${GroupOpcodeNames[GroupType.Client]} 协议 */`;
            content += `\n${T}${T}namespace ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[GroupType.Client]}${typesName}\n${T}${T}{`;
            content += to_c_result;
            content += `\n${T}${T}}\n`;
        }
        if (to_s_result.length > 0) {
            content += `\n${T}${T}/* ${GroupOpcodeNames[groupType]} to ${GroupOpcodeNames[GroupType.System]}  协议 */`;
            content += `\n${T}${T}namespace ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[GroupType.System]}${typesName}\n${T}${T}{`;
            content += to_s_result;
            content += `\n${T}${T}}\n`;
        }
        if (to_b_result.length > 0) {
            content += `\n${T}${T}/* ${GroupOpcodeNames[groupType]} to ${GroupOpcodeNames[GroupType.BG]}  协议 */`;
            content += `\n${T}${T}namespace ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[GroupType.BG]}${typesName}\n${T}${T}{`;
            content += to_b_result;
            content += `\n${T}${T}}\n`;
        }
        return content;
    }

    private compileGroupType(groupType: GroupType, groupName: string, channel: ProtocolChannel): string {
        let content: string = ``;
        for (let i = 0, size = channel[1].length; i < size; ++i) {
            let meta = channel[1][i];
            if (meta.metaRpc) {
                if (meta.metaRpc.comment) {
                    content += `\n${T}${T}${T}/* ${meta.metaRpc.comment} */`;
                }
                content += `\n${T}${T}${T}class ${this.className(meta.meta, false)}Oper : public Call<${this.className(meta.meta, false)}, ${this.className(meta.metaRpc, false)}, ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[channel[0][3]]}${this.commandSuffix}>`;
                content += `\n${T}${T}${T}{`;
                content += `\n${T}${T}${T}public:`;
                content += `\n${T}${T}${T}${T}static constexpr ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[channel[0][3]]}${this.commandSuffix} Opcode = ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[channel[0][3]]}${this.commandSuffix}::${this.className(meta.meta, false)};`;
                content += `\n${T}${T}${T}};`;
            }
            else {
                if (meta.meta.comment) {
                    content += `\n${T}${T}${T}/* ${meta.meta.comment} */`;
                }
                content += `\n${T}${T}${T}class ${this.className(meta.meta, false)}Oper : public Send<${this.className(meta.meta, false)}, ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[channel[0][3]]}${this.commandSuffix}>`;
                content += `\n${T}${T}${T}{`;
                content += `\n${T}${T}${T}public:`;
                content += `\n${T}${T}${T}${T}static constexpr ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[channel[0][3]]}${this.commandSuffix} Opcode = ${GroupOpcodeNames[groupType]}2${GroupOpcodeNames[channel[0][3]]}${this.commandSuffix}::${this.className(meta.meta, false)};`;
                content += `\n${T}${T}${T}};`;
            }
        }
        return content;
    }
}
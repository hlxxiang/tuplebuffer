import { checkTupleNames, tuple } from "../compiler/compile";
import { ProtocolsBase } from "../feature/protocols/protocols_base";
import { Log } from "../utils/log";

type ProtocolsConstructor = new (namespace: string, path: string, fileName: string) => ProtocolsBase;

let langueList = new Map<LangueType, ProtocolsConstructor>();

export class Protocols {

    private static _protocols: ProtocolArray;
    private static _groups: Array<ProtocolGroup>;

    private static _rpcFields: string;
    private static _rpcDefine: Array<[number, string, string]>;

    private static _maskName: string;
    private static _maskDefine: Array<[number, string, string]>;

    private static _bitMask: string;
    private static _bitMaskDefine: Array<[number, string, string]>;

    private static _groupName: string;
    private static _groupDefine: Array<[number, string, string]>;

    private static _channelName: string;
    private static _channelDefine: Array<[number, string, string]>;
    private static _channelLimit: number;

    private static _commandSuffix: string;
    private static _indexSuffix: string;
    private static _typesName: string;
    private static _rpcName: string;
    private static _declaration: string;
    private static _namespace: string;

    private static _segments: Array<ProtocolSegment>;

    private static _maxOpcode: number;

    public static init(
        namespace: string,
        declaration: string,
        typesName: string,
        rpcName: string,
        commandSuffix: string,
        indexSuffix: string,
        rpcFields: string, rpcDefine: Array<[number, string, string]>,
        maskName: string, maskDefine: Array<[number, string, string]>,
        bitMask: string, bitMaskDefine: Array<[number, string, string]>,
        groupName: string, groupDefine: Array<[number, string, string]>,
        channelName: string, channelDefine: Array<[number, string, string]>,
        channelLimit: number,
        maxOpcode: number,
    ): void {
        this._namespace = namespace;
        this._declaration = declaration;
        this._typesName = typesName;
        this._rpcName = rpcName;
        this._commandSuffix = commandSuffix;
        this._indexSuffix = indexSuffix;

        this._rpcFields = rpcFields;
        this._rpcDefine = rpcDefine;

        this._maskName = maskName;
        this._maskDefine = maskDefine;

        this._bitMask = bitMask;
        this._bitMaskDefine = bitMaskDefine;

        this._groupName = groupName;
        this._groupDefine = groupDefine;

        this._channelName = channelName;
        this._channelDefine = channelDefine;
        this._channelLimit = channelLimit;
        this._maxOpcode = maxOpcode;

        this._protocols = [];
        this._groups = [];

        for (const group of groupDefine) {
            this._groups[group[0]] = [];
        }

        this._segments = [];
    }

    public static add(langueType: LangueType, constructor: ProtocolsConstructor): void {
        langueList.set(langueType, constructor);
    }

    public static segment(group: number, channel: number, segment: ProtocolSegment, size: number): ProtocolSegment {
        let result: ProtocolSegment;
        if (segment == null) {
            result = [0, size, group, channel];
        } else {
            if (group !== segment[2]) {
                Log.instance.error(`group:${group}段的协议组(${segment[2]})不匹配`);
                throw new Error(`段的协议组(${segment[2]})不匹配`);
            }

            if (channel !== segment[3]) {
                Log.instance.error(`channel:${channel}段的频道(${segment[3]})不匹配`);
                throw new Error(`段的频道(${segment[3]})不匹配`);
            }
            result = [segment[0] + segment[1], size, group, channel];
        }


        let left = result[0];
        let right = result[0] + result[1];
        for (let e of this._segments) {
            if (e[2] != group || e[3] != channel) {
                continue;
            }

            let start = e[0];
            let end = start + e[1];
            if (start <= left && left < end) {
                Log.instance.error(`段的重叠了`);
                throw new Error(`段的重叠了`);
            }
            if (start < right && right <= end) {
                Log.instance.error(`段的重叠了`);
                throw new Error(`段的重叠了`);
            }
        }
        this._segments.push(result);
        return result;
    }

    //注册协议
    public static protocol(name: string, comment: string, group: number, channel: number, segment: [number, number, number, number], fields?: Array<VarMeta> | TypeMeta, fieldsReply?: Array<VarMeta> | TypeMeta): void {
        if (this._protocols.find((e) => e.name == name) != null) {
            Log.instance.error(`类型名${name}重复。`);
            throw new Error(`类型名${name}重复。`);
        }

        if (this._segments.indexOf(segment) == -1) {
            Log.instance.error(`当前段未注册`);
            throw new Error(`当前段未注册`);
        }

        let meta: ProtocolMeta = {
            name: name,
            group: group,
            channel: channel,
            comment: comment,
            meta: null,
            metaRpc: null
        };
        if (fields == null || fields instanceof Array) {
            meta.meta = tuple(name, <Array<VarMeta>>fields, comment);
            checkTupleNames.delete(name);
        } else {
            const typeMeta = <TypeMeta>fields;
            switch (typeMeta.metaType) {
                case MetaType.tuple: {
                    meta.meta = <TupleTypeMeta>typeMeta;
                    break;
                }
                default: {
                    Log.instance.error(`${name}不支持${typeMeta.metaType}类型`);
                    throw new Error(`${name}不支持${typeMeta.metaType}类型`);
                }
            }
        }
        if (fieldsReply) {
            // if (channel == ServiceType.Client) {
            //     Log.instance.error(`不能请求客户端RPC消息`);
            //     throw new Error("不能请求客户端RPC消息");
            // }
            let nameReply = name + "Reply";
            if (fieldsReply instanceof Array) {
                meta.metaRpc = tuple(nameReply, <Array<VarMeta>>fieldsReply, "RPC返回:" + comment);
                checkTupleNames.delete(nameReply);
            } else {
                const typeMeta = <TypeMeta>fieldsReply;
                switch (typeMeta.metaType) {
                    case MetaType.tuple: {
                        meta.metaRpc = <TupleTypeMeta>typeMeta;
                        break;
                    }
                    default: {
                        Log.instance.error(`${nameReply}不支持${typeMeta.metaType}类型`);
                        throw new Error(`${nameReply}不支持${typeMeta.metaType}类型`);
                    }
                }
            }
        }
        let list = this._groups[group];
        if (list == null) {
            Log.instance.error(`协议组(${group})不存在 ${name}`);
            throw new Error(`协议组(${group})不存在 ${name}`);
        }
        if (group !== segment[2]) {
            Log.instance.error(`段的协议组(${segment[2]})不匹配 ${name}`);
            throw new Error(`段的协议组(${segment[2]})不匹配 ${name}`);
        }
        if (channel !== segment[3]) {
            Log.instance.error(`段的频道(${segment[3]})不匹配 ${name}`);
            throw new Error(`段的频道(${segment[3]})不匹配 ${name}`);
        }
        let channels = list[channel];
        if (channels == null) {
            channels = list[channel] = [];
        }
        let protocolSegment = channels.find((e) => e[0] === segment);
        if (protocolSegment == null) {
            protocolSegment = [segment, []];
            channels.push(protocolSegment);
        }
        protocolSegment[1].push(meta);
        this._protocols.push(meta);
    }

    public static compile(path: string, langueType: LangueType): void {
        let langue = new (langueList.get(langueType))(this._namespace, path, `Protocols`);
        langue.init(this._maxOpcode, this._channelLimit, this._commandSuffix);
        langue.precompile(this._declaration);
        langue.compileEnum(this._rpcFields, this._rpcDefine);
        langue.compileEnum(this._maskName, this._maskDefine);
        langue.compileEnum(this._bitMask, this._bitMaskDefine);
        langue.compileEnum(this._groupName, this._groupDefine);
        langue.compileEnum(this._channelName, this._channelDefine);
        langue.compileDeclare(this._indexSuffix, ExportType.All);
        langue.compileGroups(this._groups, this._groupDefine, this._channelDefine);
        langue.compileTypes(this._typesName, this._groups, this._groupDefine, this._channelDefine);
        langue.saveFile();
    }
}
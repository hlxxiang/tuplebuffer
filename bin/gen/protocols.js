"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocols = void 0;
const compile_1 = require("../compiler/compile");
const log_1 = require("../utils/log");
let langueList = new Map();
class Protocols {
    static init(namespace, declaration, interfaceName, typesName, rpcName, commandSuffix, indexSuffix, rpcFields, rpcDefine, maskName, maskDefine, bitMask, bitMaskDefine, groupName, groupDefine, channelName, channelDefine, channelLimit, maxOpcode) {
        this._namespace = namespace;
        this._declaration = declaration;
        this._interfaceName = interfaceName;
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
    static add(langueType, constructor) {
        langueList.set(langueType, constructor);
    }
    static segment(group, channel, segment, size) {
        let result;
        if (segment == null) {
            result = [0, size, group, channel];
        }
        else {
            if (group !== segment[2]) {
                log_1.Log.instance.error(`group:${group}段的协议组(${segment[2]})不匹配`);
                throw new Error(`段的协议组(${segment[2]})不匹配`);
            }
            if (channel !== segment[3]) {
                log_1.Log.instance.error(`channel:${channel}段的频道(${segment[3]})不匹配`);
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
                log_1.Log.instance.error(`段的重叠了`);
                throw new Error(`段的重叠了`);
            }
            if (start < right && right <= end) {
                log_1.Log.instance.error(`段的重叠了`);
                throw new Error(`段的重叠了`);
            }
        }
        this._segments.push(result);
        return result;
    }
    static protocol(name, comment, group, channel, segment, fields, fieldsReply) {
        if (this._protocols.find((e) => e.name == name) != null) {
            log_1.Log.instance.error(`类型名${name}重复。`);
            throw new Error(`类型名${name}重复。`);
        }
        if (this._segments.indexOf(segment) == -1) {
            log_1.Log.instance.error(`当前段未注册`);
            throw new Error(`当前段未注册`);
        }
        let meta = {
            name: name,
            group: group,
            channel: channel,
            comment: comment,
            meta: null,
            metaRpc: null
        };
        if (fields == null || fields instanceof Array) {
            meta.meta = (0, compile_1.tuple)(name, fields, comment);
            compile_1.checkTupleNames.delete(name);
        }
        else {
            const typeMeta = fields;
            switch (typeMeta.metaType) {
                case 12: {
                    meta.meta = typeMeta;
                    break;
                }
                default: {
                    log_1.Log.instance.error(`${name}不支持${typeMeta.metaType}类型`);
                    throw new Error(`${name}不支持${typeMeta.metaType}类型`);
                }
            }
        }
        if (fieldsReply) {
            let nameReply = name + "Reply";
            if (fieldsReply instanceof Array) {
                meta.metaRpc = (0, compile_1.tuple)(nameReply, fieldsReply, "RPC请求:" + comment);
                compile_1.checkTupleNames.delete(nameReply);
            }
            else {
                const typeMeta = fieldsReply;
                switch (typeMeta.metaType) {
                    case 12: {
                        meta.metaRpc = typeMeta;
                        break;
                    }
                    default: {
                        log_1.Log.instance.error(`${nameReply}不支持${typeMeta.metaType}类型`);
                        throw new Error(`${nameReply}不支持${typeMeta.metaType}类型`);
                    }
                }
            }
        }
        let list = this._groups[group];
        if (list == null) {
            log_1.Log.instance.error(`协议组(${group})不存在 ${name}`);
            throw new Error(`协议组(${group})不存在 ${name}`);
        }
        if (group !== segment[2]) {
            log_1.Log.instance.error(`段的协议组(${segment[2]})不匹配 ${name}`);
            throw new Error(`段的协议组(${segment[2]})不匹配 ${name}`);
        }
        if (channel !== segment[3]) {
            log_1.Log.instance.error(`段的频道(${segment[3]})不匹配 ${name}`);
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
    static compile(path, langueType) {
        let langue = new (langueList.get(langueType))(this._namespace, path, `Protocols`);
        langue.init(this._maxOpcode, this._channelLimit, this._commandSuffix);
        langue.precompile(this._declaration);
        langue.compileEnum(this._rpcFields, this._rpcDefine);
        langue.compileEnum(this._maskName, this._maskDefine);
        langue.compileEnum(this._bitMask, this._bitMaskDefine);
        langue.compileEnum(this._groupName, this._groupDefine);
        langue.compileEnum(this._channelName, this._channelDefine);
        langue.compileDeclare(this._indexSuffix, this._interfaceName, 3);
        langue.compileGroups(this._groups, this._groupDefine, this._channelDefine);
        langue.compileTypes(this._typesName, this._groups, this._groupDefine, this._channelDefine);
        langue.saveFile();
    }
}
exports.Protocols = Protocols;
//# sourceMappingURL=protocols.js.map
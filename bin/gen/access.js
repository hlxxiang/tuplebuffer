"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Access = void 0;
const compile_1 = require("../compiler/compile");
const log_1 = require("../utils/log");
let langueList = new Map();
class Access {
    static init(namespace, declaration, indexSuffix, typePrefix, channelDefine) {
        this._namespace = namespace;
        this._declaration = declaration;
        this._indexSuffix = indexSuffix;
        this._channelDefine = channelDefine;
        this._groups = [[], []];
        this._groupDefine = [[0, typePrefix], [1, ""]];
        this._keys = Object.create(null);
    }
    static add(langueType, constructor) {
        langueList.set(langueType, constructor);
    }
    static record(key, type, args, comment) {
        if (this._keys[key] != null) {
            log_1.Log.instance.error(`表名${key}已经存在`);
            throw new Error(`表名${key}已经存在`);
        }
        let meta = {
            name: key,
            meta: null,
            comment: comment
        };
        let group = 1;
        if (args instanceof Array) {
            meta.meta = (0, compile_1.tuple)(key + "Record", args, comment);
            compile_1.checkTupleNames.delete(key + "Record");
        }
        else {
            let typeMeta = args;
            if (10 == typeMeta.metaType) {
                compile_1.checkTupleNames.delete(typeMeta.className);
            }
            switch (typeMeta.metaType) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    group = 0;
                    break;
            }
            meta.meta = typeMeta;
        }
        let list = this._groups[group];
        if (list == null) {
            log_1.Log.instance.error(`数据类型(${group})不存在`);
            throw new Error(`数据类型(${group})不存在`);
        }
        let channels = list[type];
        if (channels == null) {
            channels = list[type] = [];
        }
        channels.push(meta);
        this._keys[key] = true;
    }
    static compile(path, langueType) {
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `Server_Access`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, 1);
            for (const group of this._groupDefine) {
                let list = this._groups[group[0]];
                langue.compileGroupTypes(group[1], list, this._channelDefine);
            }
            langue.saveFile();
        }
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `Client_Access`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, 2);
            for (const group of this._groupDefine) {
                let list = this._groups[group[0]];
                langue.compileGroupTypes(group[1], list, this._channelDefine);
            }
            langue.saveFile();
        }
    }
}
exports.Access = Access;
//# sourceMappingURL=access.js.map
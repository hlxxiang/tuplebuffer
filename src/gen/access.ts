import { checkTupleNames, tuple } from "../compiler/compile";
import { AccessBase } from "../feature/access/access_base";
import { Log } from "../utils/log";

type AccessConstructor = new (namespace: string, path: string, fileName: string, defineName: string) => AccessBase;
let langueList = new Map<LangueType, AccessConstructor>();

export class Access {
    private static _keys: Table<boolean>;
    private static _groups: Array<Array<Array<RecordMeta>>>;

    private static _groupDefine: Array<[number, string]>;
    private static _channelDefine: Array<[number, string]>;

    private static _indexSuffix: string;
    private static _declaration: string;
    private static _namespace: string;
    private static _interfaceName: string;

    public static init(
        namespace: string,
        declaration: string,
        interfaceName: string,
        indexSuffix: string,
        typePrefix: string,
        channelDefine: Array<[number, string]>
    ): void {
        this._namespace = namespace;
        this._declaration = declaration;
        this._indexSuffix = indexSuffix;
        this._interfaceName = interfaceName;

        this._channelDefine = channelDefine;

        this._groups = [[], []];
        this._groupDefine = [[0, typePrefix], [1, ""]];

        this._keys = Object.create(null);
    }

    public static add(langueType: LangueType, constructor: AccessConstructor): void {
        langueList.set(langueType, constructor);
    }

    public static record(key: string, type: number, args: Array<VarMeta>, comment?: string): void {
        if (this._keys[key] != null) {
            Log.instance.error(`表名${key}已经存在`);
            throw new Error(`表名${key}已经存在`);
        }

        let meta: RecordMeta = {
            name: key,
            meta: null,
            comment: comment
        };

        let group = 1;
        if (args instanceof Array) {
            meta.meta = tuple(key + "Record", <Array<VarMeta>>args, comment);
            checkTupleNames.delete(key + "Record");
        } else {
            let typeMeta: TypeMeta = <TypeMeta>args;
            if (MetaType.tuple == typeMeta.metaType) {
                checkTupleNames.delete(typeMeta.className);
            }
            switch (typeMeta.metaType) {
                case MetaType.string:
                case MetaType.int32:
                case MetaType.uint32:
                case MetaType.int64:
                case MetaType.uint64:
                case MetaType.float:
                case MetaType.double:
                case MetaType.boolean:
                case MetaType.buffer:
                    group = 0;
                    break;
            }
            meta.meta = typeMeta;
        }

        let list = this._groups[group];
        if (list == null) {
            Log.instance.error(`数据类型(${group})不存在`);
            throw new Error(`数据类型(${group})不存在`);
        }
        let channels = list[type];
        if (channels == null) {
            channels = list[type] = [];
        }
        channels.push(meta);

        this._keys[key] = true;
    }

    public static compile(path: string, langueType: LangueType): void {
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `ServerAccess`, `SERVER`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, this._interfaceName, ExportType.Server);
            for (const group of this._groupDefine) {
                let list = this._groups[group[0]];
                langue.compileGroupTypes(group[1], list, this._channelDefine);
            }
            langue.saveFile();
        }
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `ClientAccess`, `CLIENT`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, this._interfaceName, ExportType.Client);
            for (const group of this._groupDefine) {
                let list = this._groups[group[0]];
                langue.compileGroupTypes(group[1], list, this._channelDefine);
            }
            langue.saveFile();
        }
    }
}
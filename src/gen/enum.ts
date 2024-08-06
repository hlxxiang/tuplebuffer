import { EnumBase } from "../feature/enum/enum_base";

type AccessConstructor = new (namespace: string, path: string, fileName: string) => EnumBase;
let langueList = new Map<LangueType, AccessConstructor>();

export class Enum {

    private static _declaration: string;
    private static _namespace: string;

    public static init(
        namespace: string,
        declaration: string,
    ): void {
        this._namespace = namespace;
        this._declaration = declaration;
    }

    public static add(langueType: LangueType, constructor: AccessConstructor): void {
        langueList.set(langueType, constructor);
    }

    public static async compile(path: string, langueType: LangueType): Promise<void> {
        let langue = new (langueList.get(langueType))(this._namespace, path, `Enum`);
        langue.precompile(this._declaration);
        langue.compileEnum();
        langue.saveFile();
    }
}
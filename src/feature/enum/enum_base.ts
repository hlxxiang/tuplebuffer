import { declareEnums } from "../../compiler/enum";

export abstract class EnumBase {
    protected path: string;
    protected fileName: string;
    protected namespace: string;

    protected content: string = "";

    protected fieldList = new Map<string, number>();

    constructor(namespace: string, path: string, fileName: string) {
        this.namespace = namespace;

        this.path = path;
        this.fileName = fileName;
    }

    public addContent(content: string): void {
        this.content += content;
    }

    public compileEnum(): string {
        let result: string = "";
        for (const tuple of declareEnums) {
            result += this.compileEnumIndex(tuple);
        }
        return result;
    }

    public abstract precompile(declaration: string): void;
    protected abstract compileEnumIndex(meta: EnumTypeMeta): void;
    public abstract saveFile(): void;
}
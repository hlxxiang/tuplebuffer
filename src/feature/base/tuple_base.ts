import { checkTupleNames, declareTypes } from "../../compiler/compile";
import { Log } from "../../utils/log";

export abstract class TupleBase {
    protected path: string;
    protected fileName: string;
    protected namespace: string;

    constructor(namespace: string, path: string, fileName: string) {
        this.namespace = namespace;

        this.path = path;
        this.fileName = fileName;
    }

    public compileDeclare(indexSuffix: string, exportType: ExportType): void {
        for (const tuple of declareTypes) {
            this.compileTuple(tuple, indexSuffix, exportType);
        }
        for (let v of checkTupleNames) {
            if (v[1] == 0) {
                Log.instance.warn(`${v[0]} 未使用`);
            }
        }
    }

    protected abstract compileTuple(meta: TupleTypeMeta, indexSuffix: string, exportType: ExportType): void;

    protected abstract className(typeMeta: TypeMeta): string;

    protected abstract classSource(typeMeta: TypeMeta, exportType?: ExportType, addOptional?: boolean): string;

    public abstract saveFile(): void;
}
import * as Excel from "exceljs";
import { Borders, FillPattern } from "exceljs";
import * as fs from "fs";
import * as filepath from "path";
import { getCellValue } from "../compiler/assembly";
import { checkTupleNames } from "../compiler/compile";
import { ConfigurationBase } from "../feature/configuration/configuration_base";
import { Log } from "../utils/log";

type ConfigurationConstructor = new (namespace: string, path: string, fileName: string) => ConfigurationBase;
let langueList = new Map<LangueType, ConfigurationConstructor>();

function mkdirSyncEx(path: string): void {
    if (!fs.existsSync(path)) {
        mkdirSyncEx(filepath.dirname(path));
        fs.mkdirSync(path);
    }
}

function writeFileSync(path: string, data: any, options?: fs.WriteFileOptions): void {
    let dir = filepath.dirname(path);
    mkdirSyncEx(dir);
    fs.writeFileSync(path, data, options);
}

export class Configuration {
    private static _paths: Table<any>;
    private static _files: Array<FileMeta>;

    private static _declaration: string;
    private static _namespace: string;
    private static _indexSuffix: string;
    private static _excelPath: string;
    private static _scriptPath: string;
    private static _jsonPath: string;
    private static _objPath: string;
    private static _assetPath: string;
    private static _clientJsonPath: string;

    private static _precompile: string = "";

    public static init(
        namespace: string,
        indexSuffix: string,
        declaration: string,
        excelPath: string,
        scriptFile: string,
        jsonPath: string,
        objPath: string,
        assetPath: string,
        clientJsonPath: string
    ): void {
        this._namespace = namespace;
        this._indexSuffix = indexSuffix;
        this._declaration = declaration;
        this._files = [];
        this._paths = Object.create(null);
        this._excelPath = excelPath;
        this._scriptPath = scriptFile;
        this._jsonPath = jsonPath;
        this._objPath = objPath;
        this._assetPath = assetPath;
        this._clientJsonPath = clientJsonPath;
    }

    public static add(langueType: LangueType, constructor: ConfigurationConstructor): void {
        langueList.set(langueType, constructor);
    }

    private static hasInvalidType(meta: TypeMeta): boolean {
        switch (meta.metaType) {
            case MetaType.table: {
                return this.hasInvalidType((<TableTypeMeta>meta).value);
            }
            case MetaType.array: {
                return this.hasInvalidType((<ArrayTypeMeta>meta).element);
            }
            case MetaType.tuple: {
                for (const field of ((<TupleTypeMeta>meta).fields)) {
                    if (this.hasInvalidType(field.meta)) {
                        return true;
                    }
                }
                break;
            }
            case MetaType.buffer: {
                return true;
            }
        }
        return false;
    }

    public static arrayFile(path: string, jsonName: string, type: TupleTypeMeta, comment?: string, format: ExportType = ExportType.All, priority: boolean = false): void {

        if (this._paths[path] != null) {
            Log.instance.error(`${path}已经存在`);
            throw new Error(`${path}已经存在`);
        }

        if (this.hasInvalidType(type)) {
            Log.instance.error(`${path}存在不支持的类型${type.metaType}`);
            throw new Error(`${path}存在不支持的类型${type.metaType}`);
        }
        checkTupleNames.delete(type.className);
        let meta: FileMeta = {
            type: FileType.array,
            name: path,
            jsonName: jsonName,
            format: format,
            element: type,
            priority: priority
        };

        this._paths[path] = meta;
        this._files.push(meta);
    }

    public static tupleFile(path: string, jsonName: string, type: TupleTypeMeta, comment?: string, format: ExportType = ExportType.All, priority: boolean = false): void {
        if (this._paths[path] != null) {
            Log.instance.error(`${path}已经存在`);
            throw new Error(`${path}已经存在`);
        }

        if (this.hasInvalidType(type)) {
            Log.instance.error(`${path}存在不支持的类型${type.metaType}`);
            throw new Error(`${path}存在不支持的类型${type.metaType}`);
        }

        let meta: FileMeta = {
            type: FileType.tuple,
            name: path,
            jsonName: jsonName,
            format: format,
            element: type,
            priority: priority
        };

        this._paths[path] = meta;
        this._files.push(meta);
    }

    public static hashFile(path: string, jsonName: string, key: string, type: TupleTypeMeta, comment?: string, format: ExportType = ExportType.All, priority: boolean = false): void {
        if (this._paths[path] != null) {
            Log.instance.error(`${path}已经存在`);
            throw new Error(`${path}已经存在`);
        }

        if (this.hasInvalidType(type)) {
            Log.instance.error(`${path}存在不支持的类型${type.metaType}`);
            throw new Error(`${path}存在不支持的类型${type.metaType}`);
        }

        let field = type.fields.find((field) => field.name == key);
        if (field == null) {
            Log.instance.error(`${path} ${type.className}中不存在属性${key}`);
            throw new Error(`${path} ${type.className}中不存在属性${key}`);
        }

        if (field.metaType != MetaType.string &&
            field.metaType != MetaType.int32 &&
            field.metaType != MetaType.int64 &&
            field.metaType != MetaType.float &&
            field.metaType != MetaType.double
        ) {
            Log.instance.error(`${path} ${type.className}的属性${key}不是string或者number类型`);
            throw new Error(`${path} ${type.className}的属性${key}不是string或者number类型`);
        }
        checkTupleNames.delete(type.className);
        let meta: FileMeta = {
            type: FileType.hash,
            name: path,
            jsonName: jsonName,
            format: format,
            element: type,
            key: key,
            priority: priority
        };

        this._paths[path] = meta;
        this._files.push(meta);
    }

    public static compile(path: string, langueType: LangueType): void {
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `server_configuration`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, ExportType.Server);
            langue.compileTypeNames(this._files, ExportType.Server);
            // 生成单行数据对应数据类型，应该用不上，
            // langue.compileTypes(this._files, ExportType.Server);
            // 整个文件的数据对应数据类型
            langue.compileStruct(this._files, ExportType.Server);
            langue.saveFile();
        }
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `client_configuration`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, ExportType.Client);
            langue.compileTypeNames(this._files, ExportType.Client);
            // 生成单行数据对应数据类型，应该用不上，
            // langue.compileTypes(this._files, ExportType.Client);
            // 整个文件的数据对应数据类型
            langue.compileStruct(this._files, ExportType.Client);
            langue.saveFile();
        }

        this.generateExcel(this._excelPath, this._files);
    }

    public static async generateExcel(excelPath: string, files: FileMeta[]): Promise<void> {
        let i = 0;
        let promises = new Array<Promise<void>>(files.length);
        for (const meta of files) {
            promises[i++] = this.generateXlsx(excelPath, meta);
        }
        await Promise.all(promises);
        this.generateEnvironmentScript();
        this.generateScript("environment", "transform.ts");
        Log.instance.log("生成结束！");
    }

    private static async generateXlsx(excelPath: string, meta: FileMeta): Promise<void> {
        let workbook = new Excel.Workbook();
        let file = filepath.join(excelPath, meta.name + ".xlsx");
        try {
            workbook = await workbook.xlsx.readFile(file);
        } catch (e) {
            workbook = null;
        }

        try {
            if (workbook != null) {
                await this.updateXlsx(meta, file, workbook);
            } else {
                await this.buildXlsx(meta, file, workbook);
            }
        } catch (e) {
            Log.instance.error(`${e}`);
        }
    }

    private static compileColumns(meta: FileMeta): Array<Partial<Excel.Column>> {
        let tuple: TupleTypeMeta = meta.element;
        let result: Array<Partial<Excel.Column>> = [];
        let fields = tuple.fields;
        for (const field of fields) {
            result.push({
                header: field.name,
                key: field.name,
                width: 20,
                outlineLevel: 1,
                hidden: false,
                style: {
                    alignment: {
                        horizontal: "right"
                    },
                    font: {
                        bold: true
                    }
                }
            });
        }
        return result;
    }

    private static compileComments(meta: FileMeta): Array<string> {
        let tuple: TupleTypeMeta = meta.element;
        let result: Array<string> = [];
        let fields = tuple.fields;
        for (const field of fields) {
            result.push(field.comment);

        }
        return result;
    }

    /** 填充元素的类型描述  */
    private static compileElementType(meta: FileMeta): Array<string> {
        let tuple: TupleTypeMeta = meta.element;
        let result: Array<string> = [];
        let fields = tuple.fields;
        for (const field of fields) {
            let types: string = "";
            switch (field.metaType) {
                case MetaType.string:
                    types = "string";
                    break;
                case MetaType.int32:
                    types = "int32";
                    break;
                case MetaType.int64:
                    types = "int64";
                    break;
                case MetaType.float:
                    types = "float";
                    break;
                case MetaType.double:
                    types = "double";
                    break;
                case MetaType.boolean:
                    types = "boolean";
                    break;
                case MetaType.tuple:
                    types = "struct";
                    break;
                case MetaType.array:
                    types = "array";
                    break;
                default:
                    break;
            }
            result.push(types);
        }
        return result;
    }

    private static async updateXlsx(meta: FileMeta, file: string, workbook: Excel.Workbook): Promise<void> {
        let sheet = workbook.getWorksheet(1);
        let columns = this.compileColumns(meta);
        let row = sheet.getRow(1);
        if (sheet.rowCount > 0) {
            if (row.cellCount > columns.length) {
                Log.instance.error(`${file}的格式头长度不匹配(${row.cellCount}>${columns.length})`);
                throw new Error(`${file}的格式头长度不匹配(${row.cellCount}>${columns.length})`);
            }
            for (let i = 0; i < row.cellCount; ++i) {
                let cell = row.getCell(i + 1);
                if (cell.value == null) {
                    Log.instance.error(`${file}的格式头元素${cell.address}的值应为${columns[i].key}不能为空`);
                    throw new Error(`${file}的格式头元素${cell.address}的值应为${columns[i].key}不能为空`);
                }
                if (cell.value.toString().trim() != columns[i].key) {
                    Log.instance.error(`${file}的格式头元素${cell.address} ${cell.value.toString()} != ${columns[i].key}`);
                    throw new Error(`${file}的格式头元素${cell.address} ${cell.value.toString()} != ${columns[i].key}`);
                }
            }
        }

        //第2行是字段类型
        row = sheet.getRow(2);
        let isUpdate: boolean = false;
        let elementTypes = this.compileElementType(meta);
        for (let i = 0; i < row.cellCount; ++i) {
            let cell = row.getCell(i + 1);
            if (cell.value != elementTypes[i]) {
                Log.instance.log(`${cell.value}${elementTypes[i]}`)
                isUpdate = true;
                break;
            }
        }

        //第3行是字段名
        row = sheet.getRow(3);
        let comments = this.compileComments(meta);
        for (let i = 0; i < row.cellCount; ++i) {
            let cell = row.getCell(i + 1);
            if (cell.value != comments[i]) {
                isUpdate = true;
                break;
            }
        }

        if (row.cellCount < comments.length) {
            isUpdate = true;
        }

        if (isUpdate) {
            let fields = meta.element.fields;
            let outFile = new Excel.Workbook();
            let outSheet = outFile.addWorksheet("");
            outSheet.columns = columns;
            outSheet.addRow(elementTypes);
            outSheet.addRow(comments);
            this.setRowStyle(outSheet);
            //从第4行开始复制数据
            for (let i = 3; i < sheet.rowCount; ++i) {
                let row = sheet.getRow(i + 1);
                let rowData: Array<any> = [];
                for (let j = 0; j < fields.length; ++j) {
                    let cell = row.getCell(j + 1);
                    let value: string = getCellValue(cell);
                    const metaType = fields[j].metaType;
                    if ("" != value) {
                        if (MetaType.int32 == metaType) {
                            rowData.push(parseInt(value));
                        }
                        else if (MetaType.int64 == metaType) {
                            rowData.push(parseInt(value));
                        }
                        else if (MetaType.float == metaType) {
                            rowData.push(parseFloat(value));
                        }
                        else if (MetaType.double == metaType) {
                            rowData.push(parseFloat(value));
                        }
                    }
                    else {
                        rowData.push(value);
                    }
                }
                outSheet.addRow(rowData);
            }
            await outFile.xlsx.writeFile(file);
            Log.instance.log(`更新文件：${file}`);
        }
    }

    private static async buildXlsx(meta: FileMeta, file: string, reason: any): Promise<void> {
        let workbook = new Excel.Workbook();
        let sheet = workbook.addWorksheet("");
        sheet.columns = this.compileColumns(meta);
        sheet.addRow(this.compileElementType(meta));
        sheet.addRow(this.compileComments(meta));
        this.setRowStyle(sheet);

        let dir = filepath.dirname(file);
        mkdirSyncEx(dir);
        await workbook.xlsx.writeFile(file);
        Log.instance.log(`新增文件：${file}`);
    }

    private static setRowStyle(sheet: Excel.Worksheet) {
        let border: Partial<Borders> = {
            top: {
                style: "thin",
                color: {
                    argb: "FF000000"
                }
            },
            bottom: {
                style: "thin",
                color: {
                    argb: "FF000000"
                }
            },
            left: {
                style: "thin",
                color: {
                    argb: "FF000000"
                }
            },
            right: {
                style: "thin",
                color: {
                    argb: "FF000000"
                }
            }
        };

        let row = sheet.getRow(1);
        row.border = border;
        row.fill = <FillPattern>{
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFFF0000"
            }
        };

        row = sheet.getRow(2);
        row.border = border;
        row.fill = <FillPattern>{
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFF9FF00"
            }
        };

        row = sheet.getRow(3);
        row.border = border;
        row.fill = <FillPattern>{
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FF00FF00"
            }
        };
    }

    public static generateEnvironmentScript(): void {
        let result = `import * as assembly from "./compiler/assembly";\n`;
        result += `import "./utils/extension";\n`
        result += `assembly.init("${this._excelPath}", "${this._jsonPath}", "${this._objPath}", "${this._assetPath}", "${this._clientJsonPath}");\n`;
        writeFileSync(filepath.join(this._scriptPath, "environment.ts"), result, { encoding: 'utf8' });
    }

    public static generateScript(environment: string, transform: string): void {
        let result: string = `import * as compile from "./compiler/compile";\n`;
        result += `import { string, int32, int64, float, double, boolean, buffer, array, table, tuple } from "./compiler/compile";`
        result += `import * as assembly from "./compiler/assembly";\n`;
        result += `import { Log } from "./utils/log";\n`;
        result += `require("./${environment}");\n`;
        result += "let pri_all: Array<Promise<void>> = [];\n";
        result += "let all: Array<Promise<void>> = [];\n";
        result += `${this._precompile}\n`
        for (const meta of this._files) {
            let excelFile = meta.name + ".xlsx";
            let exportFile = meta.jsonName;
            let priority = meta.priority;
            if (!priority) {
                continue;
            }
            switch (meta.type) {
                case FileType.array: {
                    result += `pri_all.push(assembly.arrayFile("${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case FileType.hash: {
                    result += `pri_all.push(assembly.hashFile("${exportFile}", ${meta.format}, "${excelFile}", "${meta.key}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case FileType.tuple: {
                    result += `pri_all.push(assembly.tupleFile(\n"${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
            }
        }
        result += `function run_all(): void {\n`
        for (const meta of this._files) {
            let excelFile = meta.name + ".xlsx";
            let exportFile = meta.jsonName;
            let priority = meta.priority;
            if (priority) {
                continue;
            }
            switch (meta.type) {
                case FileType.array: {
                    result += `all.push(assembly.arrayFile("${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case FileType.hash: {
                    result += `all.push(assembly.hashFile("${exportFile}", ${meta.format}, "${excelFile}", "${meta.key}",${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case FileType.tuple: {
                    result += `all.push(assembly.tupleFile(\n"${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
            }
        }
        result += `}\n`;
        result += `async function run(): Promise<void> {\n`
            + `    await Promise.all(pri_all);\n`
            + `    run_all();\n`
            + `    await Promise.all(all);\n`
            + `    Log.instance.log("生成成功!");\n`
            + `}\n`
            + `run();`;
        writeFileSync(filepath.join(this._scriptPath, `${transform}`), result, { encoding: 'utf8' });
    }

    private static parseTupleTypeMeta(meta: TupleTypeMeta): string {
        let fields = meta.fields;
        let result = "[";

        let first: boolean = true;
        for (const field of fields) {
            if (!first) {
                result += ",\n\t";
            }
            else {
                result += "\n\t";
            }
            result += this.parseVarMeta(field);
            first = false;
        }
        result += "\n]";
        return result;
    }

    private static parseVarMeta(meta: VarMeta): string {
        let result = "";
        let comment = meta.comment == null ? "null" : `"${meta.comment}"`;

        if (meta.check) {
            result += `${this.parseTypeMeta(meta.meta)}("${meta.name}", ${comment}, ${meta.exportType}, [${meta.check?.toString()}],${meta.assignType})`;
        }
        else {
            result += `${this.parseTypeMeta(meta.meta)}("${meta.name}", ${comment}, ${meta.exportType}, null, ${meta.assignType})`;
        }
        return result;
    }

    private static parseTypeMeta(meta: TypeMeta): string {
        let result = "";
        switch (meta.metaType) {
            case MetaType.string: {
                result += `${MetaName.string}`;
                break;
            }
            case MetaType.int32: {
                result += `${MetaName.int32}`;
                break;
            }
            case MetaType.int64: {
                result += `${MetaName.int64}`;
                break;
            }
            case MetaType.float: {
                result += `${MetaName.float}`;
                break;
            }
            case MetaType.double: {
                result += `${MetaName.double}`;
                break;
            }
            case MetaType.boolean: {
                result += `${MetaName.boolean}`;
                break;
            }
            case MetaType.array: {
                let arrayTypeMeta = <ArrayTypeMeta>meta;
                result += `array(${this.parseTypeMeta(arrayTypeMeta.element)})`;
                break;
            }
            case MetaType.table: {
                let hashTypeMeta = <TableTypeMeta>meta;
                result += `table(${this.parseTypeMeta(hashTypeMeta.value)})`;
                break;
            }
            case MetaType.tuple: {
                let tupleTypeMeta = <TupleTypeMeta>meta;
                result += `tuple("${tupleTypeMeta.className}",${this.parseTupleTypeMeta(tupleTypeMeta)})`
            }
        }
        return result;
    }
}
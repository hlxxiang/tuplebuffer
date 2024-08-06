"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const Excel = require("exceljs");
const fs = require("fs");
const filepath = require("path");
const assembly_1 = require("../compiler/assembly");
const compile_1 = require("../compiler/compile");
const log_1 = require("../utils/log");
let langueList = new Map();
function mkdirSyncEx(path) {
    if (!fs.existsSync(path)) {
        mkdirSyncEx(filepath.dirname(path));
        fs.mkdirSync(path);
    }
}
function writeFileSync(path, data, options) {
    let dir = filepath.dirname(path);
    mkdirSyncEx(dir);
    fs.writeFileSync(path, data, options);
}
class Configuration {
    static init(namespace, indexSuffix, declaration, excelPath, scriptFile, jsonPath, objPath, assetPath, clientJsonPath) {
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
    static add(langueType, constructor) {
        langueList.set(langueType, constructor);
    }
    static hasInvalidType(meta) {
        switch (meta.metaType) {
            case 9: {
                return this.hasInvalidType(meta.value);
            }
            case 8: {
                return this.hasInvalidType(meta.element);
            }
            case 10: {
                for (const field of (meta.fields)) {
                    if (this.hasInvalidType(field.meta)) {
                        return true;
                    }
                }
                break;
            }
            case 7: {
                return true;
            }
        }
        return false;
    }
    static arrayFile(path, jsonName, type, comment, format = 3, priority = false) {
        if (this._paths[path] != null) {
            log_1.Log.instance.error(`${path}已经存在`);
            throw new Error(`${path}已经存在`);
        }
        if (this.hasInvalidType(type)) {
            log_1.Log.instance.error(`${path}存在不支持的类型${type.metaType}`);
            throw new Error(`${path}存在不支持的类型${type.metaType}`);
        }
        compile_1.checkTupleNames.delete(type.className);
        let meta = {
            type: 1,
            name: path,
            jsonName: jsonName,
            format: format,
            element: type,
            priority: priority
        };
        this._paths[path] = meta;
        this._files.push(meta);
    }
    static tupleFile(path, jsonName, type, comment, format = 3, priority = false) {
        if (this._paths[path] != null) {
            log_1.Log.instance.error(`${path}已经存在`);
            throw new Error(`${path}已经存在`);
        }
        if (this.hasInvalidType(type)) {
            log_1.Log.instance.error(`${path}存在不支持的类型${type.metaType}`);
            throw new Error(`${path}存在不支持的类型${type.metaType}`);
        }
        let meta = {
            type: 0,
            name: path,
            jsonName: jsonName,
            format: format,
            element: type,
            priority: priority
        };
        this._paths[path] = meta;
        this._files.push(meta);
    }
    static hashFile(path, jsonName, key, type, comment, format = 3, priority = false) {
        if (this._paths[path] != null) {
            log_1.Log.instance.error(`${path}已经存在`);
            throw new Error(`${path}已经存在`);
        }
        if (this.hasInvalidType(type)) {
            log_1.Log.instance.error(`${path}存在不支持的类型${type.metaType}`);
            throw new Error(`${path}存在不支持的类型${type.metaType}`);
        }
        let field = type.fields.find((field) => field.name == key);
        if (field == null) {
            log_1.Log.instance.error(`${path} ${type.className}中不存在属性${key}`);
            throw new Error(`${path} ${type.className}中不存在属性${key}`);
        }
        if (field.metaType != 1 &&
            field.metaType != 2 &&
            field.metaType != 3 &&
            field.metaType != 4 &&
            field.metaType != 5) {
            log_1.Log.instance.error(`${path} ${type.className}的属性${key}不是string或者number类型`);
            throw new Error(`${path} ${type.className}的属性${key}不是string或者number类型`);
        }
        compile_1.checkTupleNames.delete(type.className);
        let meta = {
            type: 2,
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
    static compile(path, langueType) {
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `Server_configuration`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, 1);
            langue.compileTypeNames(this._files, 1);
            langue.compileStruct(this._files, 1);
            langue.saveFile();
        }
        {
            let langue = new (langueList.get(langueType))(this._namespace, path, `Client_configuration`);
            langue.precompile(this._declaration);
            langue.compileDeclare(this._indexSuffix, 2);
            langue.compileTypeNames(this._files, 2);
            langue.compileStruct(this._files, 2);
            langue.saveFile();
        }
        this.generateExcel(this._excelPath, this._files);
    }
    static async generateExcel(excelPath, files) {
        let i = 0;
        let promises = new Array(files.length);
        for (const meta of files) {
            promises[i++] = this.generateXlsx(excelPath, meta);
        }
        await Promise.all(promises);
        this.generateEnvironmentScript();
        this.generateScript("environment", "transform.ts");
        log_1.Log.instance.log("生成结束！");
    }
    static async generateXlsx(excelPath, meta) {
        let workbook = new Excel.Workbook();
        let file = filepath.join(excelPath, meta.name + ".xlsx");
        try {
            workbook = await workbook.xlsx.readFile(file);
        }
        catch (e) {
            workbook = null;
        }
        try {
            if (workbook != null) {
                await this.updateXlsx(meta, file, workbook);
            }
            else {
                await this.buildXlsx(meta, file, workbook);
            }
        }
        catch (e) {
            log_1.Log.instance.error(`${e}`);
        }
    }
    static compileColumns(meta) {
        let tuple = meta.element;
        let result = [];
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
    static compileComments(meta) {
        let tuple = meta.element;
        let result = [];
        let fields = tuple.fields;
        for (const field of fields) {
            result.push(field.comment);
        }
        return result;
    }
    static compileElementType(meta) {
        let tuple = meta.element;
        let result = [];
        let fields = tuple.fields;
        for (const field of fields) {
            let types = "";
            switch (field.metaType) {
                case 1:
                    types = "string";
                    break;
                case 2:
                    types = "int32";
                    break;
                case 3:
                    types = "int64";
                    break;
                case 4:
                    types = "float";
                    break;
                case 5:
                    types = "double";
                    break;
                case 6:
                    types = "boolean";
                    break;
                case 10:
                    types = "struct";
                    break;
                case 8:
                    types = "array";
                    break;
                default:
                    break;
            }
            result.push(types);
        }
        return result;
    }
    static async updateXlsx(meta, file, workbook) {
        let sheet = workbook.getWorksheet(1);
        let columns = this.compileColumns(meta);
        let row = sheet.getRow(1);
        if (sheet.rowCount > 0) {
            if (row.cellCount > columns.length) {
                log_1.Log.instance.error(`${file}的格式头长度不匹配(${row.cellCount}>${columns.length})`);
                throw new Error(`${file}的格式头长度不匹配(${row.cellCount}>${columns.length})`);
            }
            for (let i = 0; i < row.cellCount; ++i) {
                let cell = row.getCell(i + 1);
                if (cell.value == null) {
                    log_1.Log.instance.error(`${file}的格式头元素${cell.address}的值应为${columns[i].key}不能为空`);
                    throw new Error(`${file}的格式头元素${cell.address}的值应为${columns[i].key}不能为空`);
                }
                if (cell.value.toString().trim() != columns[i].key) {
                    log_1.Log.instance.error(`${file}的格式头元素${cell.address} ${cell.value.toString()} != ${columns[i].key}`);
                    throw new Error(`${file}的格式头元素${cell.address} ${cell.value.toString()} != ${columns[i].key}`);
                }
            }
        }
        row = sheet.getRow(2);
        let isUpdate = false;
        let elementTypes = this.compileElementType(meta);
        for (let i = 0; i < row.cellCount; ++i) {
            let cell = row.getCell(i + 1);
            if (cell.value != elementTypes[i]) {
                log_1.Log.instance.log(`${cell.value}${elementTypes[i]}`);
                isUpdate = true;
                break;
            }
        }
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
            for (let i = 3; i < sheet.rowCount; ++i) {
                let row = sheet.getRow(i + 1);
                let rowData = [];
                for (let j = 0; j < fields.length; ++j) {
                    let cell = row.getCell(j + 1);
                    let value = (0, assembly_1.getCellValue)(cell);
                    const metaType = fields[j].metaType;
                    if ("" != value) {
                        if (2 == metaType) {
                            rowData.push(parseInt(value));
                        }
                        else if (3 == metaType) {
                            rowData.push(parseInt(value));
                        }
                        else if (4 == metaType) {
                            rowData.push(parseFloat(value));
                        }
                        else if (5 == metaType) {
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
            log_1.Log.instance.log(`更新文件：${file}`);
        }
    }
    static async buildXlsx(meta, file, reason) {
        let workbook = new Excel.Workbook();
        let sheet = workbook.addWorksheet("");
        sheet.columns = this.compileColumns(meta);
        sheet.addRow(this.compileElementType(meta));
        sheet.addRow(this.compileComments(meta));
        this.setRowStyle(sheet);
        let dir = filepath.dirname(file);
        mkdirSyncEx(dir);
        await workbook.xlsx.writeFile(file);
        log_1.Log.instance.log(`新增文件：${file}`);
    }
    static setRowStyle(sheet) {
        let border = {
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
        row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFFF0000"
            }
        };
        row = sheet.getRow(2);
        row.border = border;
        row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFF9FF00"
            }
        };
        row = sheet.getRow(3);
        row.border = border;
        row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FF00FF00"
            }
        };
    }
    static generateEnvironmentScript() {
        let result = `import * as assembly from "./compiler/assembly";\n`;
        result += `import "./utils/extension";\n`;
        result += `assembly.init("${this._excelPath}", "${this._jsonPath}", "${this._objPath}", "${this._assetPath}", "${this._clientJsonPath}");\n`;
        writeFileSync(filepath.join(this._scriptPath, "environment.ts"), result, { encoding: 'utf8' });
    }
    static generateScript(environment, transform) {
        let result = `import * as compile from "./compiler/compile";\n`;
        result += `import { string, int32, int64, float, double, boolean, buffer, array, table, tuple } from "./compiler/compile";`;
        result += `import * as assembly from "./compiler/assembly";\n`;
        result += `import { Log } from "./utils/log";\n`;
        result += `require("./${environment}");\n`;
        result += "let pri_all: Array<Promise<void>> = [];\n";
        result += "let all: Array<Promise<void>> = [];\n";
        result += `${this._precompile}\n`;
        for (const meta of this._files) {
            let excelFile = meta.name + ".xlsx";
            let exportFile = meta.jsonName;
            let priority = meta.priority;
            if (!priority) {
                continue;
            }
            switch (meta.type) {
                case 1: {
                    result += `pri_all.push(assembly.arrayFile("${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case 2: {
                    result += `pri_all.push(assembly.hashFile("${exportFile}", ${meta.format}, "${excelFile}", "${meta.key}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case 0: {
                    result += `pri_all.push(assembly.tupleFile(\n"${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
            }
        }
        result += `function run_all(): void {\n`;
        for (const meta of this._files) {
            let excelFile = meta.name + ".xlsx";
            let exportFile = meta.jsonName;
            let priority = meta.priority;
            if (priority) {
                continue;
            }
            switch (meta.type) {
                case 1: {
                    result += `all.push(assembly.arrayFile("${exportFile}", ${meta.format}, "${excelFile}", ${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case 2: {
                    result += `all.push(assembly.hashFile("${exportFile}", ${meta.format}, "${excelFile}", "${meta.key}",${this.parseTupleTypeMeta(meta.element)}));\n`;
                    break;
                }
                case 0: {
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
    static parseTupleTypeMeta(meta) {
        let fields = meta.fields;
        let result = "[";
        let first = true;
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
    static parseVarMeta(meta) {
        var _a;
        let result = "";
        let comment = meta.comment == null ? "null" : `"${meta.comment}"`;
        if (meta.check) {
            result += `${this.parseTypeMeta(meta.meta)}("${meta.name}", ${comment}, ${meta.exportType}, [${(_a = meta.check) === null || _a === void 0 ? void 0 : _a.toString()}],${meta.assignType})`;
        }
        else {
            result += `${this.parseTypeMeta(meta.meta)}("${meta.name}", ${comment}, ${meta.exportType}, null, ${meta.assignType})`;
        }
        return result;
    }
    static parseTypeMeta(meta) {
        let result = "";
        switch (meta.metaType) {
            case 1: {
                result += `${"string"}`;
                break;
            }
            case 2: {
                result += `${"int32"}`;
                break;
            }
            case 3: {
                result += `${"int64"}`;
                break;
            }
            case 4: {
                result += `${"float"}`;
                break;
            }
            case 5: {
                result += `${"double"}`;
                break;
            }
            case 6: {
                result += `${"boolean"}`;
                break;
            }
            case 8: {
                let arrayTypeMeta = meta;
                result += `array(${this.parseTypeMeta(arrayTypeMeta.element)})`;
                break;
            }
            case 9: {
                let hashTypeMeta = meta;
                result += `table(${this.parseTypeMeta(hashTypeMeta.value)})`;
                break;
            }
            case 10: {
                let tupleTypeMeta = meta;
                result += `tuple("${tupleTypeMeta.className}",${this.parseTupleTypeMeta(tupleTypeMeta)})`;
            }
        }
        return result;
    }
}
exports.Configuration = Configuration;
Configuration._precompile = "";
//# sourceMappingURL=configuration.js.map
import * as Excel from "exceljs";
import * as fs from "fs";
import * as filepath from "path";
import * as util from "util";
import * as zlib from "zlib";
import { Log } from "../utils/log";

import Row = Excel.Row;
import Cell = Excel.Cell;
import CellRichTextValue = Excel.CellRichTextValue;
import ValueType = Excel.ValueType;
import Workbook = Excel.Workbook;
import Worksheet = Excel.Worksheet;


const msgpack5 = require("msgpack5")();
const deflateRaw = util.promisify(zlib.deflateRaw);

function mkdirSyncEx(path: string): void {
    if (!fs.existsSync(path)) {
        mkdirSyncEx(filepath.dirname(path));
        fs.mkdirSync(path);
    }
}

const writeFilePromise = util.promisify(fs.writeFile);

function writeFile(path: string, data: any, options?: fs.WriteFileOptions): Promise<void> {
    let dir = filepath.dirname(path);
    mkdirSyncEx(dir);
    return writeFilePromise(path, data, options);
}

function splitElement(content: string, start: number): number {
    let counter = 0;
    for (let i = start; i < content.length; ++i) {
        let symbol = content[i];

        switch (symbol) {
            case '[': {
                ++counter;
                break;
            }
            case ']': {
                --counter;
                break;
            }
            case '#': {
                if (counter <= 0) {
                    return i;
                }
                break;
            }
        }
    }
    return -1;
}

function nullValue(meta: TypeMeta, assignType: AssignType): any {
    if (assignType == AssignType.Value) {
        throw Error(`值不能为空`);
    } else if (assignType == AssignType.Type) {
        switch (meta.metaType) {
            case MetaType.string: {
                return "";
            }
            case MetaType.int32: {
                return 0;
            }
            case MetaType.int64: {
                return 0;
            }
            case MetaType.float: {
                return 0.0;
            }
            case MetaType.double: {
                return 0.0;
            }
            case MetaType.boolean: {
                return false;
            }
            case MetaType.array: {
                return [];
            }
            case MetaType.table: {
                return {};
            }
        }
    }
    return null;
}

export function getCellValue(cell: Cell): string {
    switch (cell.type) {
        case ValueType.Null: {
            return "";
        }
        case ValueType.Number:
        case ValueType.String: {
            if ((typeof cell.value) == "number" || (typeof cell.value) == "string") {
                return cell.value.toString();
            }
            return "";
        }
        case ValueType.Date: {
            return cell.value.toString();
        }
        case ValueType.RichText: {
            let richText = (<CellRichTextValue>cell.value).richText;
            let result = "";
            for (let data of richText) {
                result += data.text;
            }
            return result;
        }
        case ValueType.Formula: {
            return cell.result.toString();
        }
        default: {
            Log.instance.error(`未知类型(${cell.type})！`);
            throw new Error(`未知类型(${cell.type})！`)
        }
    }
}

//判断是否是空行
function isEmptyRow(row: Row, meta: Array<VarMeta>): boolean {
    for (let i = 0; i < meta.length; ++i) {
        let cell = row.getCell(i + 1);
        let value: string = getCellValue(cell);
        if (value != "") {
            return false;
        }
    }
    return true;
}

function transform(path: string, row: Row, meta: Array<VarMeta>, exportType: ExportType): Array<any> {
    let result: Array<any> = [];
    for (let i = 0; i < meta.length; ++i) {
        let field = meta[i];
        if (field.exportType & exportType) {
            let cell = row.getCell(i + 1);
            try {
                let value: string = getCellValue(cell);
                switch (field.metaType) {
                    case MetaType.table:
                    case MetaType.array:
                    case MetaType.tuple: {
                        value = `[${value}]`;
                        break;
                    }
                }
                result.push(transformElement(path, field.name, field.meta, value, field.assignType, exportType, field.check));
            } catch (e) {
                throw Error(`${field.name}(${i})发生错误：${e}`);
            }
        }
    }
    return result;
}

function transformArray(path: string, field: string, data: string, assignType: AssignType, meta: TypeMeta, exportType: ExportType): Array<any> {
    if (data.length > 0 && data[0] == '[' && data[data.length - 1] == ']') {
        data = data.substring(1, data.length - 1);
    } else {
        if (data === "0") {
            data = "";
        } else {
            throw Error(`错误的数组类型格式：${data}`);
        }
    }

    let result: Array<any>;
    if (data == "") {
        result = nullValue(meta, assignType);
    } else {
        let content: Array<any> = [];
        let start = 0;
        let end = 0;
        do {
            end = splitElement(data, start);
            if (end != -1) {
                content.push(transformElement(path, field, (<ArrayTypeMeta>meta).element, data.substring(start, end), AssignType.Type, exportType));
                start = end + 1;
            } else {
                content.push(transformElement(path, field, (<ArrayTypeMeta>meta).element, data.substring(start, data.length), AssignType.Type, exportType));
            }
        } while (end != -1);
        result = content;
    }
    return result;
}

function transformTable(path: string, field: string, data: string, assignType: AssignType, meta: TypeMeta, exportType: ExportType): Table<any> {
    if (data.length > 0 && data[0] == '[' && data[data.length - 1] == ']') {
        data = data.substring(1, data.length - 1);
    } else {
        throw Error(`错误的表类型格式：${data}`);
    }

    let result: Table<any>;
    if (data == "") {
        result = nullValue(meta, assignType);
    } else {
        let content: Table<any> = {};
        let start = 0;
        let end = 0;
        let sub: string;
        let key: string;
        let value: string;
        do {
            end = splitElement(data, start);
            if (end != -1) {
                sub = data.substring(start, end);
                start = end + 1;
            } else {
                sub = data.substring(start, data.length);
            }

            let index = sub.indexOf(':');
            if (index == -1) {
                throw Error(`表的数值格式错误`);
            } else {
                key = sub.substring(0, index);
                value = sub.substring(index + 1);
            }

            content[key] = transformElement(path, field, (<TableTypeMeta>meta).value, value, AssignType.Value, exportType);
        } while (end != -1);
        result = content;
    }
    return result;
}

function transformTuple(path: string, field: string, data: string, assignType: AssignType, meta: TypeMeta, exportType: ExportType): Array<any> {
    if (data.length > 0 && data[0] == '[' && data[data.length - 1] == ']') {
        data = data.substring(1, data.length - 1);
    } else {
        if (data === "0") {
            data = "";
        } else {
            throw Error(`错误的元组类型格式：${data}`);
        }
    }

    let result: Array<any>;
    if (data == "") {
        result = nullValue(meta, assignType);
    } else {
        let content: Array<any> = [];
        let start = 0;
        let end = 0;
        let fields = (<TupleTypeMeta>meta).fields;
        let i = 0;
        do {
            if (i >= fields.length) {
                throw Error(`超出元组的数据长度`);
            }

            end = splitElement(data, start);
            if (end != -1) {
                if (fields[i].exportType & exportType) {
                    content.push(transformElement(path, fields[i].name, fields[i].meta, data.substring(start, end), AssignType.Type, exportType, fields[i].check));
                }
                start = end + 1;
            } else {
                if (fields[i].exportType & exportType) {
                    content.push(transformElement(path, fields[i].name, fields[i].meta, data.substring(start, data.length), AssignType.Type, exportType, fields[i].check));
                }
            }

            ++i;
        } while (end != -1);

        while (i < fields.length) {
            content.push(nullValue(fields[i++].meta, assignType));
        }

        result = content;
    }
    return result;
}

function transformElement(path: string, field: string, meta: TypeMeta, data: string, assignType: AssignType, exportType: ExportType, checkFunc?: ((file: string, field: string, value: any) => void)[]): any {
    let result: any = null;
    switch (meta.metaType) {
        case MetaType.string: {
            if (data == "") {
                result = nullValue(meta, assignType);
            } else {
                result = data;
            }
            break;
        }
        case MetaType.int32: {
            if (data == "") {
                result = nullValue(meta, assignType);
            } else {
                let value: number = parseInt(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case MetaType.int64: {
            if (data == "") {
                result = nullValue(meta, assignType);
            } else {
                let value = parseInt(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case MetaType.float: {
            if (data == "") {
                result = nullValue(meta, assignType);
            } else {
                let value: number = parseFloat(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case MetaType.double: {
            if (data == "") {
                result = nullValue(meta, assignType);
            } else {
                let value: number = parseFloat(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case MetaType.boolean: {
            if (data == "true") {
                result = true;
            } else if (data == "false") {
                result = false;
            } else if (data == "") {
                result = nullValue(meta, assignType);
            } else {
                throw Error(`${data}不是一个有效的${meta.metaType}`);
            }
            break;
        }
        case MetaType.array: {
            result = transformArray(path, field, data, assignType, meta, exportType);
            break;
        }
        case MetaType.table: {
            result = transformTable(path, field, data, assignType, meta, exportType);
            break;
        }
        case MetaType.tuple: {
            result = transformTuple(path, field, data, assignType, meta, exportType);
            break;
        }
    }
    if (checkFunc && checkFunc.length > 0) {
        for (let index = 0; index < checkFunc.length; index++) {
            const f = checkFunc[index];
            f(path, field, result);
        }
    }
    return result;
}
/**
 * 0:服务端配置目录
 * 1:客户端配置目录
 * 2:客户端Assets目录
 * 3:客户端Json目录-不打包
 */
export let exportPath: [string, string, string, string];
let importPath: string;


export function init(excelPath: string, jsonPath: string, objPath: string, assetPath: string, clientJsonPath: string): void {
    importPath = excelPath;
    exportPath = [jsonPath, objPath, assetPath, clientJsonPath];
}

async function saveFile(exportFile: string, format: number, content: any, dir: string = ""): Promise<void> {
    if ((format & ExportType.Server) != 0) {
        await writeFile(dir ? filepath.join(exportPath[0], ".json", dir, exportFile
            + ".json") : filepath.join(exportPath[0], "json", exportFile + ".json"), JSON.stringify(content, null, 1), { encoding: 'utf8' });
        await writeFile(dir ? filepath.join(exportPath[0], "obj", dir, exportFile + ".obj") : filepath.join(exportPath[0], "obj", exportFile + ".obj"), await deflateRaw(msgpack5.encode(content)));
    }
    if ((format & ExportType.Client) != 0) {
        await writeFile(dir ? filepath.join(exportPath[1], "json", dir, exportFile + ".json") : filepath.join(exportPath[1], "json", exportFile + ".json"), JSON.stringify(content, null, 1), { encoding: 'utf8' });
        await writeFile(dir ? filepath.join(exportPath[1], "obj", dir, exportFile + ".obj") : filepath.join(exportPath[1], "obj", exportFile + ".obj"), await deflateRaw(msgpack5.encode(content)));
    }
}

async function readSheet(path: string, dir: string = ""): Promise<Worksheet> {
    path = dir ? filepath.join(importPath, dir, path) : filepath.join(importPath, path);
    let workbook = new Workbook();
    try {
        workbook = await workbook.xlsx.readFile(path);
    } catch (e) {
        throw e;
    }

    let sheet = workbook.getWorksheet(1);
    if (sheet.rowCount <= 3) {
        Log.instance.warn(`文件${path}没有数据`);
    }
    return sheet;
}

function toHashJson(index: number, sheet: Worksheet, meta: Array<VarMeta>, path: string, field: VarMeta, keyName: string): Table<any> {
    let content: Table<any> = {};
    let cellIndex = index + 1;
    for (let i = 3; i < sheet.rowCount; ++i) {
        let row = sheet.getRow(i + 1);
        if (isEmptyRow(row, meta)) {
            Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
            continue;
        }
        try {
            let element = transform(path, row, meta, ExportType.Server);
            let key = element[index];

            if (field.metaType == MetaType.int32 ||
                field.metaType == MetaType.int64 ||
                field.metaType == MetaType.float ||
                field.metaType == MetaType.double
            ) {
                if (key == null || isNaN(key)) {
                    Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            else if (field.metaType = MetaType.string) {
                if (key == null || key === "") {
                    Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            let k: string = key.toString();
            if (content[k] != null) {
                Log.instance.error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
                throw Error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
            }
            content[k] = element;
        } catch (e) {
            Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}

function toHashBin(index: number, sheet: Worksheet, meta: Array<VarMeta>, path: string, field: VarMeta, keyName: string): Table<any> {
    let content: Table<any> = {};
    let cellIndex = index + 1;
    for (let i = 3; i < sheet.rowCount; ++i) {
        let row = sheet.getRow(i + 1);
        if (isEmptyRow(row, meta)) {
            Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
            continue;
        }
        try {
            let element = transform(path, row, meta, ExportType.Client);
            let key = element[index];

            if (field.metaType == MetaType.int32 ||
                field.metaType == MetaType.int64 ||
                field.metaType == MetaType.float ||
                field.metaType == MetaType.double
            ) {
                if (key == null || isNaN(key)) {
                    Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            } else if (field.metaType = MetaType.string) {
                if (key == null || key === "") {
                    Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            let k: string = key.toString();
            if (content[k] != null) {
                Log.instance.error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
                throw Error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
            }
            content[k] = element;
        } catch (e) {
            Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}

export async function hashFile(exportFile: string, format: number, path: string, keyName: string, meta: Array<VarMeta>): Promise<void> {
    let index = meta.findIndex((varMeta) => varMeta.name == keyName);
    if (index == -1) {
        Log.instance.error(`文件${path}的元类型不存在KEY(${keyName})`);
        throw Error(`文件${path}的元类型不存在KEY(${keyName})`);
    }

    let field = meta[index];

    if (field.metaType != MetaType.string &&
        field.metaType != MetaType.int32 &&
        field.metaType != MetaType.int64 &&
        field.metaType != MetaType.float &&
        field.metaType != MetaType.double) {
        Log.instance.error(`文件${path}的元类型的KEY(${keyName})不是整形或者字符串)`);
        throw Error(`文件${path}的元类型的KEY(${keyName})不是整形或者字符串)`);
    }

    let sheet = await readSheet(path);
    if (!sheet) {
        return;
    }

    if (format & ExportType.Server) {
        let tempIndex = index;
        for (let i = 0; i < meta.length; ++i) {
            if (tempIndex < i) {
                break;
            }
            if (!(meta[i].exportType & ExportType.Server)) {
                --tempIndex;
            }
        }
        let content = toHashJson(tempIndex, sheet, meta, path, field, keyName);
        await saveFile(exportFile, ExportType.Server, content);
    }

    if (format & ExportType.Client) {
        let tempIndex = index;
        for (let i = 0; i < meta.length; ++i) {
            if (tempIndex < i) {
                break;
            }
            if (!(meta[i].exportType & ExportType.Client)) {
                --tempIndex;
            }
        }
        let content = toHashBin(tempIndex, sheet, meta, path, field, keyName);
        await saveFile(exportFile, ExportType.Client, content);
    }
}

function toArrayJson(sheet: Worksheet, meta: Array<VarMeta>, path: string): Array<any> {
    let content: Array<any> = [];
    for (let i = 3; i < sheet.rowCount; ++i) {
        try {
            let row = sheet.getRow(i + 1);
            if (isEmptyRow(row, meta)) {
                Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
                continue;
            }
            let element = transform(path, row, meta, ExportType.Server);
            content.push(element);
        } catch (e) {
            Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}

function toArrayBin(sheet: Worksheet, meta: Array<VarMeta>, path: string): Array<any> {
    let content: Array<any> = [];
    for (let i = 3; i < sheet.rowCount; ++i) {
        try {
            let row = sheet.getRow(i + 1);
            if (isEmptyRow(row, meta)) {
                Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
                continue;
            }
            let element = transform(path, row, meta, ExportType.Client);
            content.push(element);
        } catch (e) {
            Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}

export async function arrayFile(exportFile: string, format: DataType, path: string, meta: Array<VarMeta>): Promise<void> {
    let sheet = await readSheet(path);
    if (!sheet) {
        return;
    }

    if (format & ExportType.Server) {
        let content = toArrayJson(sheet, meta, path);
        await saveFile(exportFile, ExportType.Server, content);
    }

    if (format & ExportType.Client) {
        let content = toArrayBin(sheet, meta, path);
        await saveFile(exportFile, ExportType.Client, content);
    }
}

function toTupleJson(sheet: Worksheet, meta: Array<VarMeta>, path: string): Array<any> {
    let content: Array<any>;
    try {
        let row = sheet.getRow(3);
        if (isEmptyRow(row, meta)) {
            Log.instance.warn(`文件${path}第${3}行是空行`);
        } else {
            content = transform(path, row, meta, ExportType.Server);
        }
    } catch (e) {
        Log.instance.error(`文件${path}发生错误：${e}`);
        throw Error(`文件${path}发生错误：${e}`);
    }
    return content;
}

function toTupleBin(sheet: Worksheet, meta: Array<VarMeta>, path: string): Array<any> {
    let content: Array<any>;
    try {
        let row = sheet.getRow(3);
        if (isEmptyRow(row, meta)) {
            Log.instance.warn(`文件${path}第${3}行是空行`);
        } else {
            content = transform(path, row, meta, ExportType.Client);
        }
    } catch (e) {
        Log.instance.error(`文件${path}发生错误：${e}`);
        throw Error(`文件${path}发生错误：${e}`);
    }
    return content;
}

export async function tupleFile(exportFile: string, format: number, path: string, meta: Array<VarMeta>): Promise<void> {
    let sheet = await readSheet(path);
    if (!sheet) {
        return;
    }

    if (format & ExportType.Server) {
        let content = toTupleJson(sheet, meta, path);
        await saveFile(exportFile, ExportType.Server, content);
    }

    if (format & ExportType.Client) {
        let content = toTupleBin(sheet, meta, path);
        await saveFile(exportFile, ExportType.Client, content);
    }
}
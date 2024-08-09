"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPath = void 0;
exports.getCellValue = getCellValue;
exports.init = init;
exports.hashFile = hashFile;
exports.arrayFile = arrayFile;
exports.tupleFile = tupleFile;
const Excel = require("exceljs");
const fs = require("fs");
const filepath = require("path");
const util = require("util");
const zlib = require("zlib");
const log_1 = require("../utils/log");
var ValueType = Excel.ValueType;
var Workbook = Excel.Workbook;
const msgpack5 = require("msgpack5")();
const deflateRaw = util.promisify(zlib.deflateRaw);
function mkdirSyncEx(path) {
    if (!fs.existsSync(path)) {
        mkdirSyncEx(filepath.dirname(path));
        fs.mkdirSync(path);
    }
}
const writeFilePromise = util.promisify(fs.writeFile);
function writeFile(path, data, options) {
    let dir = filepath.dirname(path);
    mkdirSyncEx(dir);
    return writeFilePromise(path, data, options);
}
function splitElement(content, start) {
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
function nullValue(meta, assignType) {
    if (assignType == 0) {
        throw Error(`值不能为空`);
    }
    else if (assignType == 1) {
        switch (meta.metaType) {
            case 1: {
                return "";
            }
            case 2: {
                return 0;
            }
            case 3: {
                return 0;
            }
            case 4: {
                return 0;
            }
            case 5: {
                return 0;
            }
            case 6: {
                return 0.0;
            }
            case 7: {
                return 0.0;
            }
            case 8: {
                return false;
            }
            case 10: {
                return [];
            }
            case 11: {
                return {};
            }
        }
    }
    return null;
}
function getCellValue(cell) {
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
            let richText = cell.value.richText;
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
            log_1.Log.instance.error(`未知类型(${cell.type})！`);
            throw new Error(`未知类型(${cell.type})！`);
        }
    }
}
function isEmptyRow(row, meta) {
    for (let i = 0; i < meta.length; ++i) {
        let cell = row.getCell(i + 1);
        let value = getCellValue(cell);
        if (value != "") {
            return false;
        }
    }
    return true;
}
function transform(path, row, meta, exportType) {
    let result = [];
    for (let i = 0; i < meta.length; ++i) {
        let field = meta[i];
        if (field.exportType & exportType) {
            let cell = row.getCell(i + 1);
            try {
                let value = getCellValue(cell);
                switch (field.metaType) {
                    case 11:
                    case 10:
                    case 12: {
                        value = `[${value}]`;
                        break;
                    }
                }
                result.push(transformElement(path, field.name, field.meta, value, field.assignType, exportType, field.check));
            }
            catch (e) {
                throw Error(`${field.name}(${i})发生错误：${e}`);
            }
        }
    }
    return result;
}
function transformArray(path, field, data, assignType, meta, exportType) {
    if (data.length > 0 && data[0] == '[' && data[data.length - 1] == ']') {
        data = data.substring(1, data.length - 1);
    }
    else {
        if (data === "0") {
            data = "";
        }
        else {
            throw Error(`错误的数组类型格式：${data}`);
        }
    }
    let result;
    if (data == "") {
        result = nullValue(meta, assignType);
    }
    else {
        let content = [];
        let start = 0;
        let end = 0;
        do {
            end = splitElement(data, start);
            if (end != -1) {
                content.push(transformElement(path, field, meta.element, data.substring(start, end), 1, exportType));
                start = end + 1;
            }
            else {
                content.push(transformElement(path, field, meta.element, data.substring(start, data.length), 1, exportType));
            }
        } while (end != -1);
        result = content;
    }
    return result;
}
function transformTable(path, field, data, assignType, meta, exportType) {
    if (data.length > 0 && data[0] == '[' && data[data.length - 1] == ']') {
        data = data.substring(1, data.length - 1);
    }
    else {
        throw Error(`错误的表类型格式：${data}`);
    }
    let result;
    if (data == "") {
        result = nullValue(meta, assignType);
    }
    else {
        let content = {};
        let start = 0;
        let end = 0;
        let sub;
        let key;
        let value;
        do {
            end = splitElement(data, start);
            if (end != -1) {
                sub = data.substring(start, end);
                start = end + 1;
            }
            else {
                sub = data.substring(start, data.length);
            }
            let index = sub.indexOf(':');
            if (index == -1) {
                throw Error(`表的数值格式错误`);
            }
            else {
                key = sub.substring(0, index);
                value = sub.substring(index + 1);
            }
            content[key] = transformElement(path, field, meta.value, value, 0, exportType);
        } while (end != -1);
        result = content;
    }
    return result;
}
function transformTuple(path, field, data, assignType, meta, exportType) {
    if (data.length > 0 && data[0] == '[' && data[data.length - 1] == ']') {
        data = data.substring(1, data.length - 1);
    }
    else {
        if (data === "0") {
            data = "";
        }
        else {
            throw Error(`错误的元组类型格式：${data}`);
        }
    }
    let result;
    if (data == "") {
        result = nullValue(meta, assignType);
    }
    else {
        let content = [];
        let start = 0;
        let end = 0;
        let fields = meta.fields;
        let i = 0;
        do {
            if (i >= fields.length) {
                throw Error(`超出元组的数据长度`);
            }
            end = splitElement(data, start);
            if (end != -1) {
                if (fields[i].exportType & exportType) {
                    content.push(transformElement(path, fields[i].name, fields[i].meta, data.substring(start, end), 1, exportType, fields[i].check));
                }
                start = end + 1;
            }
            else {
                if (fields[i].exportType & exportType) {
                    content.push(transformElement(path, fields[i].name, fields[i].meta, data.substring(start, data.length), 1, exportType, fields[i].check));
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
function transformElement(path, field, meta, data, assignType, exportType, checkFunc) {
    let result = null;
    switch (meta.metaType) {
        case 1: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                result = data;
            }
            break;
        }
        case 2: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                let value = parseInt(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case 3: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                let value = parseInt(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case 4: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                let value = parseInt(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case 5: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                let value = parseInt(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case 6: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                let value = parseFloat(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case 7: {
            if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                let value = parseFloat(data);
                if (isNaN(value)) {
                    throw Error(`${data}不是一个有效的${meta.metaType}`);
                }
                result = value;
            }
            break;
        }
        case 8: {
            if (data == "true") {
                result = true;
            }
            else if (data == "false") {
                result = false;
            }
            else if (data == "") {
                result = nullValue(meta, assignType);
            }
            else {
                throw Error(`${data}不是一个有效的${meta.metaType}`);
            }
            break;
        }
        case 10: {
            result = transformArray(path, field, data, assignType, meta, exportType);
            break;
        }
        case 11: {
            result = transformTable(path, field, data, assignType, meta, exportType);
            break;
        }
        case 12: {
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
let importPath;
function init(excelPath, jsonPath, objPath, assetPath, clientJsonPath) {
    importPath = excelPath;
    exports.exportPath = [jsonPath, objPath, assetPath, clientJsonPath];
}
async function saveFile(exportFile, format, content, dir = "") {
    if ((format & 1) != 0) {
        await writeFile(dir ? filepath.join(exports.exportPath[0], ".json", dir, exportFile
            + ".json") : filepath.join(exports.exportPath[0], "json", exportFile + ".json"), JSON.stringify(content, null, 1), { encoding: 'utf8' });
        await writeFile(dir ? filepath.join(exports.exportPath[0], "obj", dir, exportFile + ".obj") : filepath.join(exports.exportPath[0], "obj", exportFile + ".obj"), await deflateRaw(msgpack5.encode(content)));
    }
    if ((format & 2) != 0) {
        await writeFile(dir ? filepath.join(exports.exportPath[1], "json", dir, exportFile + ".json") : filepath.join(exports.exportPath[1], "json", exportFile + ".json"), JSON.stringify(content, null, 1), { encoding: 'utf8' });
        await writeFile(dir ? filepath.join(exports.exportPath[1], "obj", dir, exportFile + ".obj") : filepath.join(exports.exportPath[1], "obj", exportFile + ".obj"), await deflateRaw(msgpack5.encode(content)));
    }
}
async function readSheet(path, dir = "") {
    path = dir ? filepath.join(importPath, dir, path) : filepath.join(importPath, path);
    let workbook = new Workbook();
    try {
        workbook = await workbook.xlsx.readFile(path);
    }
    catch (e) {
        throw e;
    }
    let sheet = workbook.getWorksheet(1);
    if (sheet.rowCount <= 3) {
        log_1.Log.instance.warn(`文件${path}没有数据`);
    }
    return sheet;
}
function toHashJson(index, sheet, meta, path, field, keyName) {
    let content = {};
    let cellIndex = index + 1;
    for (let i = 3; i < sheet.rowCount; ++i) {
        let row = sheet.getRow(i + 1);
        if (isEmptyRow(row, meta)) {
            log_1.Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
            continue;
        }
        try {
            let element = transform(path, row, meta, 1);
            let key = element[index];
            if (field.metaType == 2 ||
                field.metaType == 3 ||
                field.metaType == 4 ||
                field.metaType == 5 ||
                field.metaType == 6 ||
                field.metaType == 7) {
                if (key == null || isNaN(key)) {
                    log_1.Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            else if (field.metaType = 1) {
                if (key == null || key === "") {
                    log_1.Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            let k = key.toString();
            if (content[k] != null) {
                log_1.Log.instance.error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
                throw Error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
            }
            content[k] = element;
        }
        catch (e) {
            log_1.Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}
function toHashBin(index, sheet, meta, path, field, keyName) {
    let content = {};
    let cellIndex = index + 1;
    for (let i = 3; i < sheet.rowCount; ++i) {
        let row = sheet.getRow(i + 1);
        if (isEmptyRow(row, meta)) {
            log_1.Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
            continue;
        }
        try {
            let element = transform(path, row, meta, 2);
            let key = element[index];
            if (field.metaType == 2 ||
                field.metaType == 3 ||
                field.metaType == 4 ||
                field.metaType == 5 ||
                field.metaType == 6 ||
                field.metaType == 7) {
                if (key == null || isNaN(key)) {
                    log_1.Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            else if (field.metaType = 1) {
                if (key == null || key === "") {
                    log_1.Log.instance.error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                    throw Error(`元类型的KEY(${keyName}:${key})不是有效值， ${i}:${row.getCell(cellIndex).address})`);
                }
            }
            let k = key.toString();
            if (content[k] != null) {
                log_1.Log.instance.error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
                throw Error(`元类型的KEY(${keyName}:${key})重复， ${i}:${row.getCell(cellIndex).address})`);
            }
            content[k] = element;
        }
        catch (e) {
            log_1.Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}
async function hashFile(exportFile, format, path, keyName, meta) {
    let index = meta.findIndex((varMeta) => varMeta.name == keyName);
    if (index == -1) {
        log_1.Log.instance.error(`文件${path}的元类型不存在KEY(${keyName})`);
        throw Error(`文件${path}的元类型不存在KEY(${keyName})`);
    }
    let field = meta[index];
    if (field.metaType != 1 &&
        field.metaType != 2 &&
        field.metaType != 3 &&
        field.metaType != 4 &&
        field.metaType != 5 &&
        field.metaType != 6 &&
        field.metaType != 7) {
        log_1.Log.instance.error(`文件${path}的元类型的KEY(${keyName})不是整形或者字符串)`);
        throw Error(`文件${path}的元类型的KEY(${keyName})不是整形或者字符串)`);
    }
    let sheet = await readSheet(path);
    if (!sheet) {
        return;
    }
    if (format & 1) {
        let tempIndex = index;
        for (let i = 0; i < meta.length; ++i) {
            if (tempIndex < i) {
                break;
            }
            if (!(meta[i].exportType & 1)) {
                --tempIndex;
            }
        }
        let content = toHashJson(tempIndex, sheet, meta, path, field, keyName);
        await saveFile(exportFile, 1, content);
    }
    if (format & 2) {
        let tempIndex = index;
        for (let i = 0; i < meta.length; ++i) {
            if (tempIndex < i) {
                break;
            }
            if (!(meta[i].exportType & 2)) {
                --tempIndex;
            }
        }
        let content = toHashBin(tempIndex, sheet, meta, path, field, keyName);
        await saveFile(exportFile, 2, content);
    }
}
function toArrayJson(sheet, meta, path) {
    let content = [];
    for (let i = 3; i < sheet.rowCount; ++i) {
        try {
            let row = sheet.getRow(i + 1);
            if (isEmptyRow(row, meta)) {
                log_1.Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
                continue;
            }
            let element = transform(path, row, meta, 1);
            content.push(element);
        }
        catch (e) {
            log_1.Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}
function toArrayBin(sheet, meta, path) {
    let content = [];
    for (let i = 3; i < sheet.rowCount; ++i) {
        try {
            let row = sheet.getRow(i + 1);
            if (isEmptyRow(row, meta)) {
                log_1.Log.instance.warn(`文件${path}总行数为${sheet.rowCount}第${i + 1}行是空行`);
                continue;
            }
            let element = transform(path, row, meta, 2);
            content.push(element);
        }
        catch (e) {
            log_1.Log.instance.error(`文件${path}第${i + 1}行发生错误：${e}`);
            throw Error(`文件${path}第${i + 1}行发生错误：${e}`);
        }
    }
    return content;
}
async function arrayFile(exportFile, format, path, meta) {
    let sheet = await readSheet(path);
    if (!sheet) {
        return;
    }
    if (format & 1) {
        let content = toArrayJson(sheet, meta, path);
        await saveFile(exportFile, 1, content);
    }
    if (format & 2) {
        let content = toArrayBin(sheet, meta, path);
        await saveFile(exportFile, 2, content);
    }
}
function toTupleJson(sheet, meta, path) {
    let content;
    try {
        let row = sheet.getRow(3);
        if (isEmptyRow(row, meta)) {
            log_1.Log.instance.warn(`文件${path}第${3}行是空行`);
        }
        else {
            content = transform(path, row, meta, 1);
        }
    }
    catch (e) {
        log_1.Log.instance.error(`文件${path}发生错误：${e}`);
        throw Error(`文件${path}发生错误：${e}`);
    }
    return content;
}
function toTupleBin(sheet, meta, path) {
    let content;
    try {
        let row = sheet.getRow(3);
        if (isEmptyRow(row, meta)) {
            log_1.Log.instance.warn(`文件${path}第${3}行是空行`);
        }
        else {
            content = transform(path, row, meta, 2);
        }
    }
    catch (e) {
        log_1.Log.instance.error(`文件${path}发生错误：${e}`);
        throw Error(`文件${path}发生错误：${e}`);
    }
    return content;
}
async function tupleFile(exportFile, format, path, meta) {
    let sheet = await readSheet(path);
    if (!sheet) {
        return;
    }
    if (format & 1) {
        let content = toTupleJson(sheet, meta, path);
        await saveFile(exportFile, 1, content);
    }
    if (format & 2) {
        let content = toTupleBin(sheet, meta, path);
        await saveFile(exportFile, 2, content);
    }
}
//# sourceMappingURL=assembly.js.map
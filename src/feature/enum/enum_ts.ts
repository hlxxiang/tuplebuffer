import * as fs from "fs";
import { T } from "../../compiler/compile";
import { Log } from "../../utils/log";
import { EnumBase } from "./enum_base";

export class EnumTS extends EnumBase {
    precompile(declaration: string): void {
        let content: string = `declare namespace Gen {\n` +
            `${T}/*${declaration}*/\n` +
            `${T}namespace ${this.namespace} {\n`;
        this.addContent(content);
    }
    protected override compileEnumIndex(meta: EnumTypeMeta): void {
        let names: Table<boolean> = Object.create(null);
        let content = ``;
        if (meta.comment != null) {
            content += `\n${T}${T}/** ${meta.comment} */`;
        }
        content += `\n${T}${T}const enum ${meta.className} {`;
        let fields = meta.fields;
        if (fields != null) {
            let val = 0;
            for (let i = 0; i < fields.length; ++i) {
                let field = fields[i];
                let name = field.name;
                if (names[name]) {
                    Log.instance.error(`${meta.className} 存在重复的属性：${name}.`);
                    throw new Error(`${meta.className} 存在重复的属性：${name}.`);
                }
                names[name] = true;
                let comment = field.comment;
                let otherItem = field.otherItem;
                let value = field.value;
                let otherValue = 0;
                if (comment != null) {
                    content += `\n${T}${T}${T}/** ${comment} */`;
                }
                if (otherItem) {
                    if (!this.fieldList.has(otherItem)) {
                        let msg = `${otherItem} 不存在`;
                        throw new Error(msg);
                    }
                    otherValue = this.fieldList.get(otherItem);
                }
                if (otherItem) {
                    content += `\n${T}${T}${T}${name} = ${otherItem},`;
                    val = otherValue;
                }
                else if (null != value && !otherItem) {
                    content += `\n${T}${T}${T}${name} = ${value},`;
                    val = value;
                }
                else {
                    content += `\n${T}${T}${T}${name} = ${val},`;
                }
                this.fieldList.set(`${meta.className}.${name}`, val);
                val += 1;
            }
        }
        content += `\n${T}${T}}\n`;
        this.addContent(content);
    }

    public saveFile(): void {
        this.addContent(`\n${T}}`);
        this.addContent("\n}");
        let file = `${this.path}/${this.fileName}.d.ts`;
        fs.writeFileSync(file, this.content, { encoding: 'utf8' });
        Log.instance.debug(file);
    }
}
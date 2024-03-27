"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = void 0;
let langueList = new Map();
class Enum {
    static init(namespace, declaration) {
        this._namespace = namespace;
        this._declaration = declaration;
    }
    static add(langueType, constructor) {
        langueList.set(langueType, constructor);
    }
    static async compile(path, langueType) {
        let langue = new (langueList.get(langueType))(this._namespace, path, `enum`);
        langue.precompile(this._declaration);
        langue.compileEnum();
        langue.saveFile();
    }
}
exports.Enum = Enum;
//# sourceMappingURL=enum.js.map
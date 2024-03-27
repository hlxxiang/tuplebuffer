"use strict";
String.prototype.format = function (...args) {
    let result = this;
    for (let index = 0; index < args.length; index++) {
        result = result.replace(`{${index}}`, args[index]);
    }
    return result;
};
//# sourceMappingURL=extension.js.map
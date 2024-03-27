String.prototype.format = function (this: string, ...args: any[]): string {
    let result = this;
    for (let index = 0; index < args.length; index++) {
        result = result.replace(`{${index}}`, args[index]);
    }
    return result;
}
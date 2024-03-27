export class Log {
    private static _instance: Log;

    public static get instance(): Log {
        if (!this._instance) {
            this._instance = new Log();
        }
        return this._instance;
    }

    /** 蓝色字体 */
    public debug(message: string): void {
        console.debug("\x1B[34m%s\x1B[0m", message);
    }

    /** 青色字体 */
    public log(message: string): void {
        console.log("\x1B[36m%s\x1B[0m", message);
    }

    /** 黄色字体 */
    public warn(message: string): void {
        console.error("\x1B[33m%s\x1B[0m", message);
    }

    /** 红色字体 */
    public error(message: string): void {
        console.error("\x1B[31m%s\x1B[0m", message);
    }
}
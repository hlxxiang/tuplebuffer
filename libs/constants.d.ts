declare const enum FileType {
    tuple = 0,
    array = 1,
    hash = 2,
}

declare const enum ExportType {
    Dummy = 0,
    Server = 0x01,
    Client = 0x02,
    All = Server | Client
}

declare const enum LangueType {
    CPP = 1,
    CS,
    TS,
}

declare const enum AssignType {
    Value,
    Type,
    Null
}

/** 元数据类型 */
declare const enum MetaType {
    string = 1,
    int32,
    uint32,
    int64,
    uint64,
    float,
    double,
    boolean,
    buffer,
    array,
    table,
    tuple,
    enum,
}
/** 数据类型名 */
declare const enum MetaName {
    string = "string",
    int32 = "int32",
    uint32 = "uint32",
    int64 = "int64",
    uint64 = "uint64",
    float = "float",
    double = "double",
    boolean = "boolean",
    buffer = "buffer",
    array = "array",
    table = "table",
    tuple = "tuple",
    enum = "enum",
}
/** TS类型 */
declare const enum TypeName_TS {
    string = "string",
    int32 = "number",
    uint32 = "number",
    int64 = "number",
    uint64 = "number",
    float = "number",
    double = "number",
    boolean = "boolean",
    buffer = "Uint8Array",
    enum = "enum",
}
/** CS类型 */
declare const enum TypeName_CS {
    string = "string",
    int32 = "Int32",
    uint32 = "UInt32",
    int64 = "Int64",
    uint64 = "UInt64",
    float = "float",
    double = "double",
    boolean = "bool",
    buffer = "byte[]",
    enum = "enum",
}
/** C++类型 */
declare const enum TypeName_CPP {
    string = "string",
    int32 = "int32",
    uint32 = "uint32",
    int64 = "int64",
    uint64 = "uint64",
    float = "float",
    double = "double",
    boolean = "bool",
    buffer = "std::vector<unsigned char>",
    enum = "enum",
}

declare const enum DataType {
    Key = 0,
    Hash = 1,
    List = 2,
}

declare const enum MsgFields {
    Request = 0,
    Reply = 1,
}

declare const enum BitMask {
    SourceGroup = 20,
    TargetGroup = 24,
}

declare const enum ProtocolMask {
    SourceGroupMask = 7 << BitMask.SourceGroup,
    TargetGroupMask = 0xF << BitMask.TargetGroup
}

declare const enum GroupType {
    Client = 0,
    System = 1,
    Bg = 2,
}

/** 不同服务的协议掩码, 可扩展 */
declare const enum ServerType {
    Client = 0,
    CenterServer = 1,
    DBServer = 2,
    HttpServer = 3,
    LoginServer = 4,
    MapServer = 5,
    MatchServer = 6,
    UserServer = 7,
    End = 20
}
### 一、自定义协议、数据库、配置和枚举，同时支持多种语言 C++、C#和Typescript

#### 1. 快
     使用 msgpack 序列化和反序列化，msgpack 和 protobuf 相比，msgpack 更小更快.
#### 2. 轻量
     配置自定义导出前后端所需要的字段，数据(协议、配置和数据库数据)只存在字段值，不含字段名，10万MMO游戏角色数据在 Redis 上只占 2.5G 运行内存，RDB 文件大小 1G，前端配置占用磁盘不到 3M.
#### 3. 无中间文件
     对比 protobuf 需要生成 pb 文件，只需要使用 msgpack 库decode 和 encode 即可.
#### 4. 支持多种语言
     C++、C#和Typescript.

### 二、安装
```
1. 安装 nodejs
2. 安装 typescript: npm install -g typescript 或者指定版本 npm install -g typescript@x.x.x
3. 从package.json安装依赖: npm install
```

### 三、使用
#### 注意项
```
    为了方便可以开启实时编译运行脚本: compile.bat

    由于配置任意字段可空，而协议结构、配置结构、数据库结构都是使用一套规则，
    所有任意结构任意字段都可空，C++最低版本要求 C++17 支持 std::optional

    结构支持任意嵌套，唯一不支持实现数组的数组，无法解析匿名结构，如同 Protobuf 也不支持数组的数组，如：不支持 repeated repeated int32 id;
```
#### 1. 配置
```
    excel 文件由代码生成，导致配置也是由代码生成
    目录:
        src/imp/configuration
                
    文件:
        configuration_util.ts
        configuration.ts

    configuration_util.ts：申明配置相关结构
    configuration.ts：引用需要生成 excel 配置的源码文件
```
#### 2. 协议
```

    目录:
        src/imp/protocols
        
    文件:
        protocols_util.ts
        protocols.ts

    protocols_util.ts：申明协议相关结构
    protocols.ts：引用需要生成协议的源码文件

    协议号组成
        协议号 = GroupType << 24 | ServiceType << 20 | i，即：group (来源) 的消息发送给 service 服务
    自定义组类型 GroupType
        0：客户端
        1: 服务器
        ...
        
    自定义服务类型 ServiceType
        0：客户端(客户端看成一个服务)
        1: Gateway服务
        ...
    
    支持自定义 RPC 协议，RPC 服务器框架未给出相关代码，待定
         RPC 协议：
         `
         Protocols.protocol(
            "AuthClient", "客户端验证",
            GroupType.Client, ServiceType.Gateway, GatewaySegment.Common,
            [
                //第一个结构里面是请求的数据
                string("account", "账号"),
            ],
            [
                //第二个结构里面是返回的数据
                int64("code", "错误码"),
            ],
        );
         `
        普通协议
        `
        Protocols.protocol(
            "Ping", "客户端心跳",
            GroupType.Client, ServiceType.Gateway, GatewaySegment.Common
        );
        `
    解析协议
        如: 协议号 opcode: AuthClient = 0x100000
          groupType = opcode & Protocols.ProtocolMask.ServiceMask;
          serviceType = opcode & Protocols.ProtocolMask.ServiceMask;
        此时:
          groupType == Protocols.GroupType.Client;
          serviceType == Protocols.ServiceType.Gateway;
```

#### 3. 数据库
```
    目录:
        src/imp/access
        
    文件:
        access_util.ts
        access.ts

    access_util.ts：申明数据库相关结构
    access.ts：引用需要生成数据库的源码文件
```

#### 4. 枚举
```
    目录:
        src/imp/enums
        
    文件:
        enums_util.ts
        enums.ts
    
    enums_util.ts：申明枚举相关结构
    enums.ts：引用需要生成枚举的源码文件
```

线上项目10万MMO游戏角色数据在 Redis 上只占 2.5G 运行内存，RDB 文件大小 1G，稍加修改源码可以将前端配置打成一个配置，MMO项目占用磁盘不到 3M，非常适合h5游戏.

详细使用教程，待完善.
import { Protocols } from "../../gen/protocols";

export class GatewaySegment {
    /** 其它服务器到 Gateway 的消息段 */
    public static Common_s = Protocols.segment(GroupType.System, ServiceType.Gateway, null, 100);

    /** Client 到 Gateway 的消息段 */
    public static Common = Protocols.segment(GroupType.Client, ServiceType.Gateway, null, 100);
}

export class ClientSegment {
    /** Client 到 Gateway 的消息段 */
    public static Common = Protocols.segment(GroupType.System, ServiceType.Client, null, 100);
}
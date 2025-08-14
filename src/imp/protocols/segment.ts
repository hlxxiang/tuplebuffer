import { Protocols } from "../../gen/protocols";

export class Segment {
    /** System 到 System 的消息段 */
    public static Common_s2s = Protocols.segment(GroupType.System, ServerType.Gateway, null, 100);
    public static Test_s2s = Protocols.segment(GroupType.System, ServerType.Gateway, Segment.Common_s2s, 100);

    /** System 到 Client 的消息段 */
    public static Common_s2c = Protocols.segment(GroupType.System, ServerType.Client, null, 100);
    public static Test_s2c = Protocols.segment(GroupType.System, ServerType.Client, Segment.Common_s2c, 100);

    /** Client 到 System 的消息段 */
    public static Common_c2s = Protocols.segment(GroupType.Client, ServerType.Gateway, null, 100);
    /** Client 到 System 的消息段 */
    public static Test_c2s = Protocols.segment(GroupType.Client, ServerType.Gateway, Segment.Common_c2s, 100);
}
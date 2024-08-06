"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSegment = exports.GatewaySegment = void 0;
const protocols_1 = require("../../gen/protocols");
class GatewaySegment {
}
exports.GatewaySegment = GatewaySegment;
GatewaySegment.Common_s = protocols_1.Protocols.segment(16777216, 1048576, null, 100);
GatewaySegment.Common = protocols_1.Protocols.segment(0, 1048576, null, 100);
class ClientSegment {
}
exports.ClientSegment = ClientSegment;
ClientSegment.Common = protocols_1.Protocols.segment(16777216, 0, null, 100);
//# sourceMappingURL=segment.js.map
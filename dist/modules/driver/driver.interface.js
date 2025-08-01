"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailability = exports.DriverApprovalStatus = void 0;
var DriverApprovalStatus;
(function (DriverApprovalStatus) {
    DriverApprovalStatus["Pending"] = "pending";
    DriverApprovalStatus["Approved"] = "approved";
    DriverApprovalStatus["Suspended"] = "suspended";
    DriverApprovalStatus["Rejected"] = "rejected";
})(DriverApprovalStatus || (exports.DriverApprovalStatus = DriverApprovalStatus = {}));
var DriverAvailability;
(function (DriverAvailability) {
    DriverAvailability["Online"] = "online";
    DriverAvailability["Offline"] = "offline";
})(DriverAvailability || (exports.DriverAvailability = DriverAvailability = {}));

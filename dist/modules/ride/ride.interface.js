"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideStatus = void 0;
var RideStatus;
(function (RideStatus) {
    RideStatus["Requested"] = "requested";
    RideStatus["Accepted"] = "accepted";
    RideStatus["PickedUp"] = "picked_up";
    RideStatus["InTransit"] = "in_transit";
    RideStatus["Completed"] = "completed";
    RideStatus["Cancelled"] = "cancelled";
    RideStatus["PaymentFailed"] = "Payment_failed";
    RideStatus["PaymentCancel"] = "Payment_cancel";
})(RideStatus || (exports.RideStatus = RideStatus = {}));

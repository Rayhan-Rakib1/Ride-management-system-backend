"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SuperAdmin"] = "SUPER_ADMIN";
    Role["Admin"] = "ADMIN";
    Role["Rider"] = "RIDER";
    Role["Driver"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var User_Status;
(function (User_Status) {
    User_Status["Active"] = "Active";
    User_Status["Blocked"] = "Blocked";
})(User_Status || (exports.User_Status = User_Status = {}));

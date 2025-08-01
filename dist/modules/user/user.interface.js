"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SuperAdmin"] = "Super_Admin";
    Role["Admin"] = "Admin";
    Role["Rider"] = "Rider";
    Role["Driver"] = "Driver";
})(Role || (exports.Role = Role = {}));
var User_Status;
(function (User_Status) {
    User_Status["Active"] = "Active";
    User_Status["Blocked"] = "Blocked";
})(User_Status || (exports.User_Status = User_Status = {}));

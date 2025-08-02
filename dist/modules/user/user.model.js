"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    _id: false,
    versionKey: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    role: { type: String, enum: Object.values(user_interface_1.Role), default: user_interface_1.Role.Rider },
    status: {
        type: String,
        enum: Object.values(user_interface_1.User_Status),
        default: user_interface_1.User_Status.Active,
    },
    auth: [authSchema],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);

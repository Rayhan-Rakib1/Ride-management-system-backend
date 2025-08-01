"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = exports.updateUserStatus = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../ErrorHandler/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already exists");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVers.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credential",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email: email, password: hashPassword, auth: [authProvider] }, rest));
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User does not exists");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVers.BCRYPT_SALT_ROUND));
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        runValidators: true,
        new: true,
    });
    return updatedUser;
});
const updateUserStatus = (userId, status, requestingUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (![user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin].includes(requestingUser.role)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only admins can update user status');
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    if (user.role === user_interface_1.Role.SuperAdmin) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Cannot modify super admin status');
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { status: status }, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    return updatedUser;
});
exports.updateUserStatus = updateUserStatus;
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    updateUserStatus: exports.updateUserStatus
};

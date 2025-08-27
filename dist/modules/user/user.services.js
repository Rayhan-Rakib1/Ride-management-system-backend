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
// import bcrypt from "bcryptjs";
// import { envVars } from "../../config/env";
// const createUser = async (payload: Partial<IUser>) => {
//   const { email, password, ...rest } = payload;
//   const isUserExist = await User.findOne({ email });
//   if (isUserExist) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
//   }
//   const hashPassword = await bcrypt.hash(
//     password as string,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );
//   const authProvider: IAuthProvider = {
//     provider: "credential",
//     providerId: email as string,
//   };
//   const user = await User.create({
//     email: email,
//     password: hashPassword,
//     auth: [authProvider],
//     ...rest,
//   });
//   return user;
// };
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
// const updateUser = async (userId: string, payload: Partial<IUser>) => {
//   const isUserExist = await User.findById(userId);
//   if (!isUserExist) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User does not exists");
//   }
//   if (payload.password) {
//     payload.password = await bcrypt.hash(
//       payload.password,
//       Number(envVars.BCRYPT_SALT_ROUND)
//     );
//   }
//   const updatedUser = await User.findByIdAndUpdate(userId, payload, {
//     runValidators: true,
//     new: true,
//   });
//   return updatedUser;
// };
const updateUserStatus = (userId, status, requestingUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (![user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin].includes(requestingUser.role)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Only admins can update user status");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
    }
    if (user.role === user_interface_1.Role.SuperAdmin) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cannot modify super admin status");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { status: status }, { new: true, runValidators: true }).select("-password");
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
    }
    return updatedUser;
});
exports.updateUserStatus = updateUserStatus;
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(401, "User does not exist");
    }
    return user;
});
exports.UserServices = {
    // createUser,
    getAllUsers,
    // updateUser,
    updateUserStatus: exports.updateUserStatus,
    getMe,
};

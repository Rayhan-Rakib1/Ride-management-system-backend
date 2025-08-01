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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.UserStatus = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const user_services_1 = require("./user.services");
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "User created successfully",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "All users",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const result = yield user_services_1.UserServices.updateUser(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Updated user",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
exports.UserStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { status } = req.body;
    const result = yield user_services_1.UserServices.updateUserStatus(userId, status, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: `User ${status} successfully`,
        data: result,
    });
}));
exports.UserController = {
    createUser,
    getAllUsers,
    updateUser,
    UserStatus: exports.UserStatus
};

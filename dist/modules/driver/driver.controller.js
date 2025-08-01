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
exports.DriverController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const driver_services_1 = require("./driver.services");
const AppError_1 = __importDefault(require("../../ErrorHandler/AppError"));
const driver_model_1 = require("./driver.model");
const createDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || !user.userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not authenticated");
    }
    const result = yield driver_services_1.DriverServices.createDriver(req.body, user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Driver created successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const getAllDrivers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_services_1.DriverServices.getAllDriver();
    (0, sendResponse_1.sendResponse)(res, {
        message: "All drivers retrieved successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const getDriverById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const driver = yield driver_model_1.Driver.findById(id);
    if (user.userId !== (driver === null || driver === void 0 ? void 0 : driver.userId.toString())) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Drivers can only access their own profile");
    }
    const result = yield driver_services_1.DriverServices.getDriverById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    (0, sendResponse_1.sendResponse)(res, {
        message: "Driver retrieved successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const updateDriverAvailability = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // This is userId (or driverId) from URL
    const user = req.user;
    const { availability } = req.body;
    // Find the driver by userId or _id based on your routing logic
    const driver = yield driver_model_1.Driver.findOne({ userId: id });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    if (user.userId !== driver.userId.toString()) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Drivers can only update their own availability");
    }
    const result = yield driver_services_1.DriverServices.updateDriverAvailability(id, availability);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Driver availability updated successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const updateDriverStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    const result = yield driver_services_1.DriverServices.updateDriverStatus(id, approvalStatus);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Driver status updated successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const getDriverRideHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    if (user.userId !== id) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Drivers can only view their own ride history");
    }
    const result = yield driver_services_1.DriverServices.getDriverRideHistory(id);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Driver ride history retrieved successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const getDriverEarnings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    if (user.userId !== id) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Drivers can only view their own earnings");
    }
    const result = yield driver_services_1.DriverServices.getDriverEarnings(id);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Driver earnings retrieved successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const acceptRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = req.params;
    const user = req.user;
    const result = yield driver_services_1.DriverServices.acceptRide(rideId, user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Ride accepted successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const updateRideStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = yield driver_services_1.DriverServices.updateRideStatus(rideId, user.userId, status);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Ride status updated successfully",
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
exports.DriverController = {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriverAvailability,
    updateDriverStatus,
    getDriverRideHistory,
    getDriverEarnings,
    acceptRide,
    updateRideStatus,
};

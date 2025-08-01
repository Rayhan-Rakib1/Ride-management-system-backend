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
exports.DriverServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../ErrorHandler/AppError"));
const driver_interface_1 = require("./driver.interface");
const driver_model_1 = require("./driver.model");
const user_model_1 = require("../user/user.model");
const ride_model_1 = require("../ride/ride.model");
const createDriver = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isDriverExist = yield driver_model_1.Driver.findOne({ userId });
    if (isDriverExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Driver already exists");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    yield user_model_1.User.findByIdAndUpdate(userId, { role: "Driver" }, { new: true, runValidators: true });
    const driverData = {
        userId,
        role: "Driver",
        vehicleInfo: payload.vehicleInfo,
        license: payload.license,
        approvalStatus: "pending",
        isAvailable: false,
        totalRides: 0,
        totalEarnings: 0,
    };
    const driver = yield driver_model_1.Driver.create(driverData);
    return driver;
});
const getAllDriver = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_model_1.Driver.find().populate("userId", "name email phone");
    return result;
});
const getDriverById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id).populate("userId", "name email phone");
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    return driver;
});
const updateDriverAvailability = (userId, availability) => __awaiter(void 0, void 0, void 0, function* () {
    // First find by userId (since your schema uses userId to reference the user)
    const driver = yield driver_model_1.Driver.findOne({ userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    if (driver.approvalStatus !== driver_interface_1.DriverApprovalStatus.Approved) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not approved");
    }
    // Update availability
    const result = yield driver_model_1.Driver.findOneAndUpdate({ userId }, { availability, updatedAt: new Date() }, { new: true, runValidators: true });
    return result;
});
const updateDriverStatus = (id, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: id });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    const result = yield driver_model_1.Driver.findOneAndUpdate({ userId: id }, { approvalStatus, updatedAt: new Date() }, { new: true, runValidators: true });
    return result;
});
const getDriverRideHistory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: id });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    const rides = yield ride_model_1.Ride.find({ driverId: id }).populate("riderId", "name email");
    return rides;
});
const getDriverEarnings = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: id });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    const rides = yield ride_model_1.Ride.find({ driverId: id, status: "completed" });
    const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    return {
        totalEarnings,
        rides,
    };
});
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    if (driver.approvalStatus !== "approved") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not approved");
    }
    if (!driver.availability) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not available");
    }
    const activeRide = yield ride_model_1.Ride.findOne({
        driverId,
        status: { $in: ["accepted", "picked_up", "in_transit"] },
    });
    if (activeRide) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Driver is already assigned to an active ride");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (ride.status !== "requested") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride is not available for acceptance");
    }
    const result = yield ride_model_1.Ride.findByIdAndUpdate(rideId, { driverId: driverId, status: "accepted", updatedAt: new Date() }, { new: true, runValidators: true }).populate("riderId", "name email");
    yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, { isAvailable: false });
    return result;
});
const updateRideStatus = (rideId, driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (!ride.driverId || ride.driverId.toString() !== driverId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not assigned to this ride");
    }
    const validStatusTransitions = {
        requested: ["accepted"],
        accepted: ["picked_up"],
        picked_up: ["in_transit"],
        in_transit: ["completed"],
        completed: [],
        cancelled: [],
    };
    if (!validStatusTransitions[ride.status].includes(status)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid status transition from ${ride.status} to ${status}`);
    }
    const updates = { status, updatedAt: new Date() };
    if (status === "Completed") {
        updates.fare = ride.fare || 0; // Ensure fare is recorded
        yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, {
            $inc: { totalRides: 1, totalEarnings: updates.fare },
            isAvailable: true,
            updatedAt: new Date(),
        }, { new: true });
    }
    const result = yield ride_model_1.Ride.findByIdAndUpdate(rideId, updates, {
        new: true,
        runValidators: true,
    }).populate("riderId", "name email");
    return result;
});
exports.DriverServices = {
    createDriver,
    getAllDriver,
    getDriverById,
    updateDriverAvailability,
    updateDriverStatus,
    getDriverRideHistory,
    getDriverEarnings,
    acceptRide,
    updateRideStatus,
};

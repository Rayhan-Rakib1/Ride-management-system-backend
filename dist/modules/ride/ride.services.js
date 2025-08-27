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
exports.RideServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../ErrorHandler/AppError"));
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("../driver/driver.model");
const createRide = (payload, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(riderId);
    if (!user || user.role !== "Rider") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User is not a valid rider");
    }
    const activeRide = yield ride_model_1.Ride.findOne({
        riderId,
        status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
    });
    if (activeRide) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Rider already has an active ride");
    }
    const rideData = {
        riderId,
        pickup: payload.pickup,
        destination: payload.destination,
        status: ride_interface_1.RideStatus.Requested,
        duration: payload.duration,
        distance: payload.distance,
        fare: payload.fare,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const ride = yield ride_model_1.Ride.create(rideData);
    return ride.populate("riderId", "name email");
});
const cancelRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (ride.riderId.toString() !== riderId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Rider can only cancel their own ride");
    }
    if (ride.status !== "requested") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride can only be cancelled before acceptance");
    }
    const result = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
        status: ride_interface_1.RideStatus.Cancelled,
        updatedAt: new Date(),
    }, { new: true, runValidators: true }).populate("riderId", "name email");
    return result;
});
const updateRideStatus = (rideId, driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const driver = yield driver_model_1.Driver.findOne({ userId: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    }
    if (driver.approvalStatus !== "approved") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not approved");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not assigned to this ride");
    }
    const validStatusTransitions = {
        [ride_interface_1.RideStatus.Requested]: [ride_interface_1.RideStatus.Accepted],
        [ride_interface_1.RideStatus.Accepted]: [ride_interface_1.RideStatus.PickedUp],
        [ride_interface_1.RideStatus.PickedUp]: [ride_interface_1.RideStatus.InTransit],
        [ride_interface_1.RideStatus.InTransit]: [ride_interface_1.RideStatus.Completed],
        [ride_interface_1.RideStatus.Completed]: [],
        [ride_interface_1.RideStatus.Cancelled]: [],
        [ride_interface_1.RideStatus.PaymentFailed]: [],
        [ride_interface_1.RideStatus.PaymentCancel]: []
    };
    if (!validStatusTransitions[ride.status].includes(status)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid status transition from ${ride.status} to ${status}`);
    }
    const updates = {
        status,
        updatedAt: new Date(),
    };
    if (status === ride_interface_1.RideStatus.Completed) {
        updates.fare = ride.fare || 0;
        yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, { $inc: { totalRides: 1, totalEarnings: updates.fare }, isAvailable: true, updatedAt: new Date() }, { new: true });
    }
    const result = yield ride_model_1.Ride.findByIdAndUpdate(rideId, updates, { new: true, runValidators: true }).populate("riderId driverId", "name email");
    return result;
});
const getRideById = (rideId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId).populate("riderId driverId", "name email");
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (role === "rider" && ride.riderId.toString() !== userId ||
        role === "driver" && ((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Access denied to this ride");
    }
    return ride;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find().populate("riderId driverId", "name email").sort({ createdAt: -1 });
    return rides;
});
exports.RideServices = {
    createRide,
    cancelRide,
    updateRideStatus,
    getRideById,
    getAllRides,
};

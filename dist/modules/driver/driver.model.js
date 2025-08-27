"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const driverSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, required: true },
    auth: [{ provider: { type: String }, providerId: { type: String } }],
    approvalStatus: {
        type: String,
        enum: {
            values: Object.values(driver_interface_1.DriverApprovalStatus),
            message: "{VALUE} is not a valid approval status",
        },
        default: driver_interface_1.DriverApprovalStatus.Pending,
    },
    availability: {
        type: String,
        enum: {
            values: Object.values(driver_interface_1.DriverAvailability),
            message: "{VALUE} is not a valid availability status",
        },
        default: driver_interface_1.DriverAvailability.Offline,
    },
    vehicleInfo: {
        vehicleType: {
            type: String,
            enum: ["car", "bike", "van"],
            required: [true, "Vehicle type is required"],
        },
        number: {
            type: String,
            required: [true, "License plate number is required"],
            trim: true,
        },
        color: {
            type: String,
            required: [true, "Vehicle color is required"],
            trim: true,
        },
        model: { type: String, trim: true },
        year: {
            type: Number,
            min: [1900, "Vehicle year must be after 1900"],
            max: [
                new Date().getFullYear() + 1,
                "Vehicle year cannot be in the future",
            ],
        },
    },
    license: {
        number: {
            type: String,
            required: [true, "License number is required"],
            trim: true,
        },
        expiryDate: {
            type: Date,
            required: [true, "License expiry date is required"],
        },
    },
    currentLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            validate: {
                validator: function (val) {
                    if (!val)
                        return true; // optional
                    return val.length === 2;
                },
                message: "Coordinates must be [longitude, latitude]",
            },
        },
    },
    // Extra fields from interface
    address: { type: String, required: [true, "Address is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    profileImage: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    rating: {
        type: Number,
        min: [1, "Rating must be between 1 and 5"],
        max: [5, "Rating must be between 1 and 5"],
        default: 5,
    },
    totalRides: {
        type: Number,
        default: 0,
        min: [0, "Total rides cannot be negative"],
    },
    totalEarnings: {
        type: Number,
        default: 0,
        min: [0, "Total earnings cannot be negative"],
    },
}, { timestamps: true });
driverSchema.index({ currentLocation: "2dsphere" }); // for geo queries
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailabilityZodSchema = exports.updateDriverZodSchema = exports.createDriverZodSchema = void 0;
const zod_1 = require("zod");
const driver_interface_1 = require("./driver.interface");
// Common fields
const baseDriverSchema = {
    name: zod_1.z.string({ required_error: "Name is required" }).min(1).trim(),
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    password: zod_1.z.string({ required_error: "Password is required" }).min(6),
    role: zod_1.z.string({ required_error: "Role is required" }),
    phone: zod_1.z.string({ required_error: "Phone is required" }).min(5).trim(),
    address: zod_1.z.string({ required_error: "Address is required" }).min(3).trim(),
    profileImage: zod_1.z.string().url().optional(),
    gender: zod_1.z.enum(["male", "female", "other"]).optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    nationality: zod_1.z.string().optional(),
};
// Create Driver Schema
exports.createDriverZodSchema = zod_1.z.object(Object.assign(Object.assign({}, baseDriverSchema), { vehicleInfo: zod_1.z.object({
        vehicleType: zod_1.z.enum(["car", "bike", "van"]),
        number: zod_1.z.string().min(1, "License plate number is required"),
        color: zod_1.z.string().min(1, "Vehicle color is required"),
        model: zod_1.z.string().optional(),
        year: zod_1.z
            .number()
            .min(1900, "Vehicle year must be after 1900")
            .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future")
            .optional(),
    }), license: zod_1.z.object({
        number: zod_1.z.string().min(1, "License number is required"),
        expiryDate: zod_1.z.string().refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date > new Date();
        }, { message: "License expiry date must be a valid date in the future" }),
    }), currentLocation: zod_1.z
        .object({
        type: zod_1.z.literal("Point"),
        coordinates: zod_1.z
            .array(zod_1.z.number())
            .length(2)
            .refine(([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90, { message: "Invalid coordinates" }),
    })
        .optional() }));
// Update Driver Schema
exports.updateDriverZodSchema = zod_1.z.object({
    name: zod_1.z.string().trim().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().url().optional(),
    gender: zod_1.z.enum(["male", "female", "other"]).optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    nationality: zod_1.z.string().optional(),
    approvalStatus: zod_1.z
        .nativeEnum(driver_interface_1.DriverApprovalStatus)
        .optional(),
    availability: zod_1.z
        .nativeEnum(driver_interface_1.DriverAvailability)
        .optional(),
    vehicleInfo: zod_1.z
        .object({
        vehicleType: zod_1.z.enum(["car", "bike", "van"]).optional(),
        number: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        year: zod_1.z
            .number()
            .min(1900, "Vehicle year must be after 1900")
            .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future")
            .optional(),
    })
        .optional(),
    license: zod_1.z
        .object({
        number: zod_1.z.string().optional(),
        expiryDate: zod_1.z
            .string()
            .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date > new Date();
        }, { message: "License expiry date must be valid & in the future" })
            .optional(),
    })
        .optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
    totalRides: zod_1.z.number().min(0).optional(),
    totalEarnings: zod_1.z.number().min(0).optional(),
});
// Update Driver Availability
exports.DriverAvailabilityZodSchema = zod_1.z.object({
    availability: zod_1.z.nativeEnum(driver_interface_1.DriverAvailability, {
        required_error: "Availability is required",
    }),
});

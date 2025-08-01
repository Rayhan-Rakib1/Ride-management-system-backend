"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailabilityZodSchema = exports.updateDriverZodSchema = exports.createDriverZodSchema = void 0;
const zod_1 = require("zod");
const driver_interface_1 = require("./driver.interface");
// Schema for creating a driver (used in POST /drivers/create-driver)
exports.createDriverZodSchema = zod_1.z.object({
    vehicleInfo: zod_1.z.object({
        vehicleType: zod_1.z.enum(["car", "bike", "van"]),
        number: zod_1.z.string(),
        color: zod_1.z.string(),
        model: zod_1.z.string().optional(),
        year: zod_1.z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    }),
    license: zod_1.z.object({
        number: zod_1.z.string(),
        expiryDate: zod_1.z.string().refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date > new Date();
        }, { message: "License expiry date must be a valid date in the future" }),
    }),
    currentLocation: zod_1.z.object({
        type: zod_1.z.literal("Point"),
        coordinates: zod_1.z.array(zod_1.z.number()).length(2).refine(([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90, { message: "Invalid coordinates" }),
    }).optional(),
});
// Schema for updating driver details (used in PATCH /drivers/:id)
exports.updateDriverZodSchema = zod_1.z.object({
    approvalStatus: zod_1.z
        .nativeEnum(driver_interface_1.DriverApprovalStatus, {
        invalid_type_error: `Approval status must be one of: ${Object.values(driver_interface_1.DriverApprovalStatus).join(", ")}`,
    })
        .optional(),
    availability: zod_1.z
        .nativeEnum(driver_interface_1.DriverAvailability, {
        invalid_type_error: `Availability must be one of: ${Object.values(driver_interface_1.DriverAvailability).join(", ")}`,
    })
        .optional(),
    vehicleInfo: zod_1.z
        .object({
        vehicleType: zod_1.z.enum(["car", "bike", "van"], {
            invalid_type_error: "Vehicle type must be one of: car, bike, van",
        }).optional(),
        number: zod_1.z
            .string({ invalid_type_error: "License plate number must be a string" })
            .min(1, "License plate number cannot be empty")
            .trim()
            .optional(),
        color: zod_1.z
            .string({ invalid_type_error: "Vehicle color must be a string" })
            .min(1, "Vehicle color cannot be empty")
            .trim()
            .optional(),
        model: zod_1.z
            .string({ invalid_type_error: "Vehicle model must be a string" })
            .trim()
            .optional(),
        year: zod_1.z
            .number({ invalid_type_error: "Vehicle year must be a number" })
            .min(1900, "Vehicle year must be after 1900")
            .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future")
            .optional(),
    })
        .optional(),
    license: zod_1.z
        .object({
        number: zod_1.z
            .string({ invalid_type_error: "License number must be a string" })
            .min(1, "License number cannot be empty")
            .trim()
            .optional(),
        expiryDate: zod_1.z
            .string({ invalid_type_error: "License expiry date must be a string" })
            .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date > new Date();
        }, { message: "License expiry date must be a valid date in the future" })
            .optional(),
    })
        .optional(),
    rating: zod_1.z
        .number({ invalid_type_error: "Rating must be a number" })
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),
});
// Schema for updating driver availability (used in PATCH /drivers/:id/availability)
exports.DriverAvailabilityZodSchema = zod_1.z.object({
    availability: zod_1.z.enum([driver_interface_1.DriverAvailability.Online, driver_interface_1.DriverAvailability.Offline], {
        required_error: "Availability is required",
        invalid_type_error: `Availability must be one of: ${Object.values(driver_interface_1.DriverAvailability).join(", ")}`,
    }),
});

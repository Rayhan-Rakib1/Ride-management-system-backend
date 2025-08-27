"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRideZodSchema = exports.updateRideStatusZodSchema = exports.createRideZodSchema = void 0;
const zod_1 = require("zod");
const ride_interface_1 = require("./ride.interface");
exports.createRideZodSchema = zod_1.z.object({
    rider: zod_1.z.string({
        required_error: "Rider ID is required",
        invalid_type_error: "Rider ID must be a string",
    }),
    pickup: zod_1.z.object({
        lat: zod_1.z
            .number({
            required_error: "Pickup latitude is required",
            invalid_type_error: "Pickup latitude must be a number",
        })
            .refine((val) => val >= -90 && val <= 90, {
            message: "Pickup latitude must be between -90 and 90",
        }),
        lng: zod_1.z
            .number({
            required_error: "Pickup longitude is required",
            invalid_type_error: "Pickup longitude must be a number",
        })
            .refine((val) => val >= -180 && val <= 180, {
            message: "Pickup longitude must be between -180 and 180",
        }),
        address: zod_1.z
            .string({
            required_error: "Pickup address is required",
            invalid_type_error: "Pickup address must be a string",
        })
            .min(1, "Pickup address cannot be empty"),
    }),
    destination: zod_1.z.object({
        lat: zod_1.z
            .number({
            required_error: "Destination latitude is required",
            invalid_type_error: "Destination latitude must be a number",
        })
            .refine((val) => val >= -90 && val <= 90, {
            message: "Destination latitude must be between -90 and 90",
        }),
        lng: zod_1.z
            .number({
            required_error: "Destination longitude is required",
            invalid_type_error: "Destination longitude must be a number",
        })
            .refine((val) => val >= -180 && val <= 180, {
            message: "Destination longitude must be between -180 and 180",
        }),
        address: zod_1.z
            .string({
            required_error: "Destination address is required",
            invalid_type_error: "Destination address must be a string",
        })
            .min(1, "Destination address cannot be empty"),
    }),
    fare: zod_1.z.number({
        required_error: "Fare is required",
        invalid_type_error: "Fare must be a number",
    }),
    distance: zod_1.z.number({
        required_error: "Distance is required",
        invalid_type_error: "Distance must be a number",
    }),
    duration: zod_1.z.number({
        required_error: "Duration is required",
        invalid_type_error: "Duration must be a number",
    }),
});
// Schema for updating ride status (used in PATCH /rides/:id/status)
exports.updateRideStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(ride_interface_1.RideStatus), {
        required_error: "Status is required",
        invalid_type_error: "Status must be one of: requested, accepted, picked_up, in_transit, completed, cancelled",
    }),
});
// Schema for cancelling a ride (used in PATCH /rides/:id/cancel)
exports.cancelRideZodSchema = zod_1.z.object({
    body: zod_1.z.object({}).strict(), // No body required for cancellation, enforce empty object
});

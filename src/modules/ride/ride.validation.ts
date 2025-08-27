import { z } from "zod";
import { RideStatus } from "./ride.interface";



export const createRideZodSchema = z.object({
  rider: z.string({
    required_error: "Rider ID is required",
    invalid_type_error: "Rider ID must be a string",
  }),

  pickup: z.object({
    lat: z
      .number({
        required_error: "Pickup latitude is required",
        invalid_type_error: "Pickup latitude must be a number",
      })
      .refine((val) => val >= -90 && val <= 90, {
        message: "Pickup latitude must be between -90 and 90",
      }),
    lng: z
      .number({
        required_error: "Pickup longitude is required",
        invalid_type_error: "Pickup longitude must be a number",
      })
      .refine((val) => val >= -180 && val <= 180, {
        message: "Pickup longitude must be between -180 and 180",
      }),
    address: z
      .string({
        required_error: "Pickup address is required",
        invalid_type_error: "Pickup address must be a string",
      })
      .min(1, "Pickup address cannot be empty"),
  }),

  destination: z.object({
    lat: z
      .number({
        required_error: "Destination latitude is required",
        invalid_type_error: "Destination latitude must be a number",
      })
      .refine((val) => val >= -90 && val <= 90, {
        message: "Destination latitude must be between -90 and 90",
      }),
    lng: z
      .number({
        required_error: "Destination longitude is required",
        invalid_type_error: "Destination longitude must be a number",
      })
      .refine((val) => val >= -180 && val <= 180, {
        message: "Destination longitude must be between -180 and 180",
      }),
    address: z
      .string({
        required_error: "Destination address is required",
        invalid_type_error: "Destination address must be a string",
      })
      .min(1, "Destination address cannot be empty"),
  }),

  fare: z.number({
    required_error: "Fare is required",
    invalid_type_error: "Fare must be a number",
  }),

  distance: z.number({
    required_error: "Distance is required",
    invalid_type_error: "Distance must be a number",
  }),

  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration must be a number",
  }),
});


// Schema for updating ride status (used in PATCH /rides/:id/status)
export const updateRideStatusZodSchema = z.object({

    status: z.enum(Object.values(RideStatus) as [string, ...string[]], {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of: requested, accepted, picked_up, in_transit, completed, cancelled",
    }),
  })


// Schema for cancelling a ride (used in PATCH /rides/:id/cancel)
export const cancelRideZodSchema = z.object({
  body: z.object({}).strict(), // No body required for cancellation, enforce empty object
});
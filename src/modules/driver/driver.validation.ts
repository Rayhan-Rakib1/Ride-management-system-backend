import { z } from "zod";
import mongoose from "mongoose";
import { DriverApprovalStatus, DriverAvailability } from "./driver.interface";



// Schema for creating a driver (used in POST /drivers/create-driver)
export const createDriverZodSchema = z.object({
  vehicleInfo: z.object({
    vehicleType: z.enum(["car", "bike", "van"]),
    number: z.string(),
    color: z.string(),
    model: z.string().optional(),
    year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  }),

  license: z.object({
    number: z.string(),
    expiryDate: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, { message: "License expiry date must be a valid date in the future" }),
  }),

  currentLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2).refine(
      ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
      { message: "Invalid coordinates" }
    ),
  }).optional(),
});



// Schema for updating driver details (used in PATCH /drivers/:id)
export const updateDriverZodSchema = z.object({

      approvalStatus: z
        .nativeEnum(DriverApprovalStatus, {
          invalid_type_error: `Approval status must be one of: ${Object.values(DriverApprovalStatus).join(", ")}`,
        })
        .optional(),
      availability: z
        .nativeEnum(DriverAvailability, {
          invalid_type_error: `Availability must be one of: ${Object.values(DriverAvailability).join(", ")}`,
        })
        .optional(),
      vehicleInfo: z
        .object({
          vehicleType: z.enum(["car", "bike", "van"], {
            invalid_type_error: "Vehicle type must be one of: car, bike, van",
          }).optional(),
          number: z
            .string({ invalid_type_error: "License plate number must be a string" })
            .min(1, "License plate number cannot be empty")
            .trim()
            .optional(),
          color: z
            .string({ invalid_type_error: "Vehicle color must be a string" })
            .min(1, "Vehicle color cannot be empty")
            .trim()
            .optional(),
          model: z
            .string({ invalid_type_error: "Vehicle model must be a string" })
            .trim()
            .optional(),
          year: z
            .number({ invalid_type_error: "Vehicle year must be a number" })
            .min(1900, "Vehicle year must be after 1900")
            .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future")
            .optional(),
        })
        .optional(),
    
      license: z
        .object({
          number: z
            .string({ invalid_type_error: "License number must be a string" })
            .min(1, "License number cannot be empty")
            .trim()
            .optional(),
          expiryDate: z
            .string({ invalid_type_error: "License expiry date must be a string" })
            .refine(
              (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime()) && date > new Date();
              },
              { message: "License expiry date must be a valid date in the future" }
            )
            .optional(),
        })
        .optional(),
       
      rating: z
        .number({ invalid_type_error: "Rating must be a number" })
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),
  
});

// Schema for updating driver availability (used in PATCH /drivers/:id/availability)
export const DriverAvailabilityZodSchema = z.object({

      availability: z.enum([DriverAvailability.Online, DriverAvailability.Offline], {
        required_error: "Availability is required",
        invalid_type_error: `Availability must be one of: ${Object.values(DriverAvailability).join(", ")}`,
      }),
    });

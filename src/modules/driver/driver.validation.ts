import { z } from "zod";
import { DriverApprovalStatus, DriverAvailability } from "./driver.interface";

// Common fields
const baseDriverSchema = {
  name: z.string({ required_error: "Name is required" }).min(1).trim(),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z.string({ required_error: "Password is required" }).min(6),
  role: z.string({ required_error: "Role is required" }),

  phone: z.string({ required_error: "Phone is required" }).min(5).trim(),
  address: z.string({ required_error: "Address is required" }).min(3).trim(),
  profileImage: z.string().url().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().datetime().optional(),
  nationality: z.string().optional(),
};

// Create Driver Schema
export const createDriverZodSchema = z.object({
  ...baseDriverSchema,

  vehicleInfo: z.object({
    vehicleType: z.enum(["car", "bike", "van"]),
    number: z.string().min(1, "License plate number is required"),
    color: z.string().min(1, "Vehicle color is required"),
    model: z.string().optional(),
    year: z
      .number()
      .min(1900, "Vehicle year must be after 1900")
      .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future")
      .optional(),
  }),

  license: z.object({
    number: z.string().min(1, "License number is required"),
    expiryDate: z.string().refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
      },
      { message: "License expiry date must be a valid date in the future" }
    ),
  }),

  currentLocation: z
    .object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2)
        .refine(
          ([lng, lat]) =>
            lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
          { message: "Invalid coordinates" }
        ),
    })
    .optional(),
});

// Update Driver Schema
export const updateDriverZodSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().url().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().datetime().optional(),
  nationality: z.string().optional(),

  approvalStatus: z
    .nativeEnum(DriverApprovalStatus)
    .optional(),
  availability: z
    .nativeEnum(DriverAvailability)
    .optional(),

  vehicleInfo: z
    .object({
      vehicleType: z.enum(["car", "bike", "van"]).optional(),
      number: z.string().optional(),
      color: z.string().optional(),
      model: z.string().optional(),
      year: z
        .number()
        .min(1900, "Vehicle year must be after 1900")
        .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future")
        .optional(),
    })
    .optional(),

  license: z
    .object({
      number: z.string().optional(),
      expiryDate: z
        .string()
        .refine(
          (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date > new Date();
          },
          { message: "License expiry date must be valid & in the future" }
        )
        .optional(),
    })
    .optional(),

  rating: z.number().min(1).max(5).optional(),
  totalRides: z.number().min(0).optional(),
  totalEarnings: z.number().min(0).optional(),
});

// Update Driver Availability
export const DriverAvailabilityZodSchema = z.object({
  availability: z.nativeEnum(DriverAvailability, {
    required_error: "Availability is required",
  }),
});

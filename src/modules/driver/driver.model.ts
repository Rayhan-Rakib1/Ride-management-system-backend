import { Schema, model } from "mongoose";
import { DriverApprovalStatus, DriverAvailability, IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, trim: true },
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: [true, "Password is required"] },

    role: { type: String, required: true },
    auth: [{ provider: { type: String }, providerId: { type: String } }],

    approvalStatus: {
      type: String,
      enum: {
        values: Object.values(DriverApprovalStatus),
        message: "{VALUE} is not a valid approval status",
      },
      default: DriverApprovalStatus.Pending,
    },

    availability: {
      type: String,
      enum: {
        values: Object.values(DriverAvailability),
        message: "{VALUE} is not a valid availability status",
      },
      default: DriverAvailability.Offline,
    },

    vehicleInfo: {
      vehicleType: {
        type: String,
        enum: ["car", "bike", "van"],
        required: [true, "Vehicle type is required"],
      },
      number: { type: String, required: [true, "License plate number is required"], trim: true },
      color: { type: String, required: [true, "Vehicle color is required"], trim: true },
      model: { type: String, trim: true },
      year: {
        type: Number,
        min: [1900, "Vehicle year must be after 1900"],
        max: [new Date().getFullYear() + 1, "Vehicle year cannot be in the future"],
      },
    },

    license: {
      number: { type: String, required: [true, "License number is required"], trim: true },
      expiryDate: { type: Date, required: [true, "License expiry date is required"] },
    },

    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: (val: number[]) => val.length === 2,
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

    rating: { type: Number, min: [1, "Rating must be between 1 and 5"], max: [5, "Rating must be between 1 and 5"], default: 5 },
    totalRides: { type: Number, default: 0, min: [0, "Total rides cannot be negative"] },
    totalEarnings: { type: Number, default: 0, min: [0, "Total earnings cannot be negative"] },
  },
  { timestamps: true }
);

driverSchema.index({ currentLocation: "2dsphere" }); // for geo queries

export const Driver = model<IDriver>("Driver", driverSchema);

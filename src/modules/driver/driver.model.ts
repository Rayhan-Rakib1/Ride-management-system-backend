import { Schema, model } from "mongoose";
import {
  DriverApprovalStatus,
  DriverAvailability,
  IDriver,
} from "./driver.interface";
import { Role } from "../user/user.interface";

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true, // Ensure one driver per user
    },
    role: {
      type: String,
      default: Role.Driver,
      enum: {
        values: [Role.Driver],
        message: "{VALUE} is not a valid role for drivers",
      },
    },
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
        enum: {
          values: ["car", "bike", "van"],
          message: "{VALUE} is not a valid vehicle type",
        },
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
      model: {
        type: String,
        trim: true,
      },
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
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Coordinates are required if location is provided"],
      },
    },
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
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
  },
  {
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);

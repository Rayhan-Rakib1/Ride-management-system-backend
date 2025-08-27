import { Schema, model } from "mongoose";
import { IRider, Rider_Status } from "./rider.interface";

const RiderSchema = new Schema<IRider>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, required: true },
    auth: [{ provider: String, providerId: String }],
    status: {
      type: String,
      enum: Object.values(Rider_Status),
      default: Rider_Status.Active,
    },
    address: { type: String },
    phone: { type: String, required: true },
    profileImage: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    nationality: { type: String },
  },
  { timestamps: true }
);

export const Rider = model<IRider>("Rider", RiderSchema);

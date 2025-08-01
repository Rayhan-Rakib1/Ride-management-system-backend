import { Types } from "mongoose";

export enum DriverApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Suspended = "suspended",
  Rejected = "rejected",
}

export enum DriverAvailability {
  Online = "online",
  Offline = "offline",
}

export interface IDriver {
  userId: Types.ObjectId;
  role: string;
  approvalStatus: DriverApprovalStatus;
  availability: DriverAvailability;
  vehicleInfo: {
    vehicleType: "car" | "bike" | "van";
    number: string;
    color: string;
    model?: string;
    year?: number;
  };
  license: {
    number: string;
    expiryDate: Date;
  };
  currentLocation?: {
    type: "Point";
    coordinates: [number, number];
  };
  rating?: number;
  totalRides: number;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

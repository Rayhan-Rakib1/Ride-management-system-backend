import { Types } from "mongoose";

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  PickedUp = "picked_up",
  InTransit = "in_transit",
  Completed = "completed",
  Cancelled = "cancelled",
  PaymentSuccessful = "paymentSuccessful",
  PaymentFailed = "Payment_failed",
  PaymentCancel = "Payment_cancel",
}
export enum VehicleType {
  Bike = "bike",
  Car = "car",
  CNG = "cng",
}

export type TRideStatus = RideStatus;

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  payment?: Types.ObjectId;
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  status: RideStatus;
  vehicle: VehicleType;
  fare: number;
  distance: number;
  duration: number;
  rating?: {
    riderRating?: number;
    driverRating?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

import { Types } from "mongoose";

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  PickedUp = "picked_up",
  InTransit = "in_transit",
  Completed = "completed",
  Cancelled = "cancelled",
  PaymentFailed = "Payment_failed",
  PaymentCancel = "Payment_cancel"
}

export type TRideStatus = RideStatus; 

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  payment?:Types.ObjectId,
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

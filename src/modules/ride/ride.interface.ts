import { Types } from "mongoose";

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  PickedUp = "picked_up",
  InTransit = "in_transit",
  Completed = "completed",
  Cancelled = "cancelled",
}

export type TRideStatus = keyof typeof RideStatus;

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
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
  history: {
    status: RideStatus;
    timestamp: Date;
  }[];
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

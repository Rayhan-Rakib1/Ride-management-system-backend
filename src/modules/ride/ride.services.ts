/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";

const createRide = async (payload: Partial<IRide>, riderId: any) => {
  const user = await User.findById(riderId);
  if (!user || user.role !== "Rider") {
    throw new AppError(StatusCodes.FORBIDDEN, "User is not a valid rider");
  }

  const activeRide = await Ride.findOne({
    riderId,
    status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
  });
  if (activeRide) {
    throw new AppError(StatusCodes.CONFLICT, "Rider already has an active ride");
  }

  const rideData: Partial<IRide> = {
    riderId,
    pickup: payload.pickup,
    destination: payload.destination,
    status: RideStatus.Requested,
    history: [{ status: RideStatus.Requested, timestamp: new Date() }],
    duration: payload.duration,
    distance: payload.distance,
    fare: payload.fare,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ride = await Ride.create(rideData);
  return ride.populate("riderId", "name email");
};

const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (ride.riderId.toString() !== riderId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Rider can only cancel their own ride");
  }

  if (ride.status !== "requested") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Ride can only be cancelled before acceptance");
  }

  const result = await Ride.findByIdAndUpdate(
    rideId,
    {
      status: RideStatus.Cancelled,
      history: [...ride.history, { status: RideStatus.Cancelled, timestamp: new Date() }],
      updatedAt: new Date(),
    },
    { new: true, runValidators: true }
  ).populate("riderId", "name email");

  return result;
};

const updateRideStatus = async (rideId: string, driverId: string, status: RideStatus) => {
  const driver = await Driver.findOne({ userId: driverId });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  if (driver.approvalStatus !== "approved") {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver is not approved");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (ride.driverId?.toString() !== driverId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver is not assigned to this ride");
  }

  const validStatusTransitions: Record<RideStatus, RideStatus[]> = {
    [RideStatus.Requested]: [RideStatus.Accepted],
    [RideStatus.Accepted]: [RideStatus.PickedUp],
    [RideStatus.PickedUp]: [RideStatus.InTransit],
    [RideStatus.InTransit]: [RideStatus.Completed],
    [RideStatus.Completed]: [],
    [RideStatus.Cancelled]: [],
  };

  if (!validStatusTransitions[ride.status].includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Invalid status transition from ${ride.status} to ${status}`);
  }

  const updates: Partial<IRide> = {
    status,
    history: [...ride.history, { status, timestamp: new Date() }],
    updatedAt: new Date(),
  };

  if (status === RideStatus.Completed) {
    updates.fare = ride.fare || 0; 
    await Driver.findOneAndUpdate(
      { userId: driverId },
      { $inc: { totalRides: 1, totalEarnings: updates.fare }, isAvailable: true, updatedAt: new Date() },
      { new: true }
    );
  }

  const result = await Ride.findByIdAndUpdate(rideId, updates, { new: true, runValidators: true }).populate(
    "riderId driverId",
    "name email"
  );

  return result;
};

const getRideById = async (rideId: string, userId: string, role: string) => {
  const ride = await Ride.findById(rideId).populate("riderId driverId", "name email");
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (
    role === "rider" && ride.riderId.toString() !== userId ||
    role === "driver" && ride.driverId?.toString() !== userId
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, "Access denied to this ride");
  }

  return ride;
};

const getRiderRideHistory = async (riderId: string) => {
  const rides = await Ride.find({ riderId }).populate("riderId driverId", "name email").sort({ createdAt: -1 });
  return rides;
};

const getAllRides = async () => {
  const rides = await Ride.find().populate("riderId driverId", "name email").sort({ createdAt: -1 });
  return rides;
};

export const RideServices = {
  createRide,
  cancelRide,
  updateRideStatus,
  getRideById,
  getRiderRideHistory,
  getAllRides,
};
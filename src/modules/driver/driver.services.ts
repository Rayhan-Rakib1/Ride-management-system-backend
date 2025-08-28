/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import {
  DriverApprovalStatus,
  IAuthProvider,
  IDriver,
} from "./driver.interface";
import { Driver } from "./driver.model";
import { User } from "../user/user.model";
import { Ride } from "../ride/ride.model";
import { RideStatus, TRideStatus } from "../ride/ride.interface";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Role } from "../user/user.interface";

const createDriver = async (payload: Partial<IDriver>) => {
  const { name, email, password, profileImage, phone, address, ...rest } =
    payload;
  const isDriverExist = await Driver.findOne({ email });
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You are already driver");
  }

  if (isDriverExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Driver already exist");
  }
  if (!envVars.BCRYPT_SALT_ROUND) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Salt round not configured"
    );
  }

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND) | 10
  );

  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const driver = await Driver.create({
    name: name,
    email: email,
    password: hashPassword,
    address: address,
    phone: phone,
    auth: [authProvider],
    role: Role.Driver,
    profileImage: profileImage,
    ...rest,
  });

  const user = await User.create({
    name: name,
    email: email,
    password: hashPassword,
    address: address,
    phone: phone,
    auth: [authProvider],
    profileImage: profileImage,
    role: Role.Driver,
  });
  return { driver, user };
};

const getAllDriver = async () => {
  const result = await Driver.find();
  return result;
};

const getDriverCurrentRide = async (email: string) => {
  const driver = await Driver.findOne({ email });
  if (!driver) {
    throw new AppError(401, "driver not found");
  }
  const driverDoc = await Driver.findOne({ email }).select("_id");
  const driverId = driverDoc?._id;
  // console.log(driverId);
  // console.log(driver);

  const currentRideDriver = await Ride.find({
    driverId: driverId,
    status: { $ne: RideStatus.Requested }
  })
    .populate("riderId", "name email phone gender")
    .populate("driverId", "name email phone gender ");
  return currentRideDriver;
};

const getDriverById = async (id: string) => {
  const driver = await Driver.findById(id).populate(
    "userId",
    "name email phone"
  );
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }
  return driver;
};

const updateDriverAvailability = async (
  userId: string,
  availability: "online" | "offline"
) => {
  // First find by userId (since your schema uses userId to reference the user)
  const driver = await Driver.findOne({ userId });

  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  if (driver.approvalStatus !== DriverApprovalStatus.Approved) {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver is not approved");
  }

  // Update availability
  const result = await Driver.findOneAndUpdate(
    { userId },
    { availability, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  return result;
};

const updateDriverStatus = async (
  id: string,
  approvalStatus: "pending" | "approved" | "suspended" | "rejected"
) => {
  const driver = await Driver.findOne({ userId: id });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  const result = await Driver.findOneAndUpdate(
    { userId: id },
    { approvalStatus, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  return result;
};

const getDriverRideHistory = async (driverEmail: string) => {
  const driverDoc = await Driver.findOne({email: driverEmail}).select("_id");
  const id = driverDoc?._id;
  const driver = await Driver.findOne({email: driverEmail});
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }


  const rides = await Ride.find({ driverId: id }).populate(
    "riderId",
    "name email address phone gender fare rating"
  );
  return rides;
};

const getDriverEarnings = async (id: string) => {
  const driver = await Driver.findOne({ _id: id });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  const rides = await Ride.find({ driverId: id, status: "completed" });
  const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return {
    totalEarnings,
    rides,
  };
};

const acceptRide = async (rideId: string, email: string) => {
  const driverDoc = await Driver.findOne({ email }).select("_id");
  if (!driverDoc) throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  const driverId = driverDoc._id;

  const driver = await Driver.findOne({ email });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  // if (driver.approvalStatus !== DriverApprovalStatus.Approved) {
  //   throw new AppError(StatusCodes.FORBIDDEN, "Driver is not approved");
  // }

  if (!driver.availability) {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver is not available");
  }

  const activeRide = await Ride.findOne({
    driverId,
    status: { $in: ["accepted", "picked_up", "in_transit"] },
  });
  if (activeRide) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Driver is already assigned to an active ride"
    );
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (ride.status !== "requested") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Ride is not available for acceptance"
    );
  }

  const result = await Ride.findByIdAndUpdate(
    rideId,
    { driverId: driverId, status: "accepted", updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate("riderId", "name email");

  await Driver.findOneAndUpdate({ userId: driverId }, { isAvailable: false });

  return result;
};

const updateRideStatus = async (
  rideId: string,
  email: string,
  status: TRideStatus
) => {
  const driverDoc = await Driver.findOne({ email }).select("_id");
  if (!driverDoc) throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  const driverId = driverDoc._id;
  const driver = await Driver.findOne({ email }).select("_id");
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  console.log(ride.driverId);
  console.log(driverId);

  if (!ride.driverId?.toString() || ride.driverId.toString() !== driverId.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Driver is not assigned to this ride"
    );
  }
  const validStatusTransitions: Record<string, string[]> = {
    requested: ["accepted"],
    accepted: ["picked_up"],
    picked_up: ["in_transit"],
    in_transit: ["completed"],
    completed: [],
    cancelled: [],
  };

  if (!validStatusTransitions[ride.status].includes(status)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Invalid status transition from ${ride.status} to ${status}`
    );
  }
  const updates: any = { status, updatedAt: new Date() };
  if (status === RideStatus.Completed) {
    updates.fare = ride.fare || 0; // Ensure fare is recorded
    await Driver.findOneAndUpdate(
      { userId: driverId },
      {
        $inc: { totalRides: 1, totalEarnings: updates.fare },
        isAvailable: true,
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  const result = await Ride.findByIdAndUpdate(rideId, updates, {
    new: true,
    runValidators: true,
  }).populate("riderId", "name email");

  return result;
};

const deleteDriverAccount = async (userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(404, "user no found");
  }

  await User.findByIdAndDelete(userId);
};

export const DriverServices = {
  createDriver,
  getAllDriver,
  getDriverCurrentRide,
  getDriverById,
  updateDriverAvailability,
  updateDriverStatus,
  getDriverRideHistory,
  getDriverEarnings,
  acceptRide,
  updateRideStatus,
  deleteDriverAccount,
};

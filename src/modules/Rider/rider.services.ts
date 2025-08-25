import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import { IAuthProvider, IRider } from "./rider.interface";
import { Rider } from "./rider.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Ride } from "../ride/ride.model";

const createRider = async (payload: Partial<IRider>) => {
  const { name, email, password, profileImage, ...rest } = payload;
  const isRiderExist = await Rider.findOne({ email });
  if (isRiderExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rider already exist");
  }

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const rider = await Rider.create({
    name: name,
    email: email,
    password: hashPassword,
    auth: [authProvider],
    ...rest,
  });

  const user = await User.create({
    name: name,
    email: email,
    password: hashPassword,
    profileImage: profileImage,
    auth: [authProvider],
    role: Role.Rider,
  });

  return { rider, user };
};

// ----------------------------
const getAllRiders = async () => {
  const AllRiders = await Rider.find();
  return AllRiders;
};

// ------------------------------------------------
const getRiderProfile = async (userId: string) => {
  const rider = await Rider.findById(userId);
  if (!rider) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rider not exist");
  }

  return rider;
};
// ----------------------------------------------------------
const updateRiderProfile = async (userId: string, payload: Partial<IRider>) => {
  const rider = await Rider.findById(userId);
  if (!rider) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rider not exist");
  }

  const updatedRider = await Rider.findByIdAndUpdate(userId, payload, {
    runValidators: true,
    new: true,
  });

  return updatedRider;
};

// -------------------------------------------------------------
const getRiderHistory = async (userId: string) => {
  const rider = await Rider.findById(userId);
  if (!rider) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rider not exist");
  }

  const history = await Ride.find({ riderId: userId })
    .select(
      "pickup destination status fare distance duration rating createdAt updatedAt"
    )
    .sort({ createdAt: -1 });

  return history;
};

// ---------------------------------
const getRiderById = async (rideId: string) => {
  const rider = await Rider.findById(rideId);
  if (!rideId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rider does not exist");
  }
  return rider;
};
const deleteRiderAccountMe = async (rideId: string) => {
  await Rider.findByIdAndDelete(rideId)
  return;
};
const deleteRiderAccountById = async (rideId: string) => {
  await Rider.findByIdAndDelete(rideId)
  return;
};

export const RiderServices = {
  createRider,
  getAllRiders,
  getRiderProfile,
  updateRiderProfile,
  getRiderHistory,
  getRiderById,
  deleteRiderAccountMe,
  deleteRiderAccountById
};

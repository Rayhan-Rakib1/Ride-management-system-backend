import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVers } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVers.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const user = await User.create({
    email: email,
    password: hashPassword,
    auth: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exists");
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVers.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    runValidators: true,
    new: true,
  });
  return updatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};

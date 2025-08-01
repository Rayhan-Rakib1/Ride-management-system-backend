import { JwtPayload } from "jsonwebtoken";

import { StatusCodes } from "http-status-codes";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { envVers } from "../config/env";
import { User } from "../modules/user/user.model";
import AppError from "../ErrorHandler/AppError";

export const createToken = (user: Partial<IUser>) => {
  if (!user._id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User ID is missing");
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVers.JWT_ACCESS_SECRET,
    envVers.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVers.JWT_REFRESH_SECRET,
    envVers.JWT_REFRESH_EXPIRES
  );

  return { accessToken, refreshToken };
};


export const getNewAccessTokenUsingRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVers.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  const jwtPayload = {
    userId: isUserExist._id.toString(),
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVers.JWT_ACCESS_SECRET,
    envVers.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};

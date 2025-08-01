/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";

import bcrypt from "bcryptjs";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../ErrorHandler/AppError";
import { createToken, getNewAccessTokenUsingRefreshToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../../config/env";


const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist");
  }

  const passwordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!passwordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password dose not matched");
  }

  const userTokens = createToken(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// ----------------------------------------------------------------------------------------------------
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await getNewAccessTokenUsingRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};


// -----------------------------------------
const resetPassword = async (oldPassword: string, newPassword: string,  decodedToken: JwtPayload) => {
const user = await User.findById(decodedToken.userId);

const isOldPassword = await bcrypt.compare(oldPassword , user!.password as string);
if(!isOldPassword){
  throw new AppError(StatusCodes.BAD_REQUEST, "Enter your old password")
}

user!.password  = await bcrypt.hash(newPassword, Number(envVers.BCRYPT_SALT_ROUND));
user!.save();
}

export const authService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword
};

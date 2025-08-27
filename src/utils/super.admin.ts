import { envVars } from "../config/env";
import AppError from "../ErrorHandler/AppError";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

import bcrypt from "bcryptjs";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { Types } from "mongoose";

export const superAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Super admin already exist");
    }

    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      _id: new Types.ObjectId(),
      name: "Super admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      auth: [authProvider],
      role: Role.SuperAdmin,
      profileImage: ""
    };

    await User.create(payload);
  } catch (error) {
    console.log(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../ErrorHandler/AppError";
import { verifyToken } from "../utils/jwt";
import { envVers } from "../config/env";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";


export const checkAuth =(...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "Access token not found");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVers.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not authorized");
      }
   

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not authorized");
      }

      req.user = verifiedToken;
      next();
    } catch (err) {
      next(err);
    }
  };

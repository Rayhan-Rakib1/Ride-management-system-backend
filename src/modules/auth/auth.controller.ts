/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.services";
import { setAuthCookie } from "../../utils/setCookie";

import passport from "passport";
import AppError from "../../ErrorHandler/AppError";
import { createToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { envVars } from "../../config/env";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(
          new AppError(401, info?.message || "Authentication failed")
        );
      }

      const userTokens = await createToken(user);

      setAuthCookie(res, userTokens);

      const { password: pass, ...rest } = user.toObject();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "user login successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          data: rest,
        },
      });
    })(req, res, next);
  }
);

// ---------------------------------------------------
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authService.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Access token created  successfully",
      data: tokenInfo,
    });
  }
);

// ---------------------------------------------------------
const userLogout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logout successfully",
      data: null,
    });
  }
);

// ---------------------------------------------------------------------
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req?.user as JwtPayload;

    await authService.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Change password successfully",
      data: null,
    });
  }
);

// -------------------------------------------------------------------
const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user as IUser;
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
    }

    const tokenInfo = createToken(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authController = {
  credentialLogin,
  getNewAccessToken,
  userLogout,
  resetPassword,
  googleCallback,
};

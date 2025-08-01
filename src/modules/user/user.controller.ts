import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
      success: true,
      message: "All users",
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const result = await UserServices.updateUser(userId, payload);
    sendResponse(res, {
      message: "Updated user",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

export const UserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const { status } = req.body;
    const result = await UserServices.updateUserStatus(userId, status, req.user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `User ${status} successfully`,
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  UserStatus
};

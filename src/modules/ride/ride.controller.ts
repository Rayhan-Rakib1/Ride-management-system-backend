import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RideServices } from "./ride.services";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHandler/AppError";

const createRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;
  if (!user || !user.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const result = await RideServices.createRide(req.body, user.userId);

  sendResponse(res, {
    message: "Ride requested successfully",
    success: true,
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const cancelRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;

  if (!user || !user.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const result = await RideServices.cancelRide(id, user.userId);

  sendResponse(res, {
    message: "Ride cancelled successfully",
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user as JwtPayload;

  if (!user || !user.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const result = await RideServices.updateRideStatus(id, user.userId, status);

  sendResponse(res, {
    message: "Ride status updated successfully",
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getRideById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;

  if (!user || !user.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const result = await RideServices.getRideById(id, user.userId, user.role);

  sendResponse(res, {
    message: "Ride retrieved successfully",
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getRiderRideHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;

  if (!user || !user.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const result = await RideServices.getRiderRideHistory(user.userId);

  sendResponse(res, {
    message: "Rider ride history retrieved successfully",
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await RideServices.getAllRides();

  sendResponse(res, {
    message: "All rides retrieved successfully",
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const RideController = {
  createRide,
  cancelRide,
  updateRideStatus,
  getRideById,
  getRiderRideHistory,
  getAllRides,
};
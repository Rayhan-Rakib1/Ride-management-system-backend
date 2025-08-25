import {  Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DriverServices } from "./driver.services";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHandler/AppError";
import { Driver } from "./driver.model";

const createDriver = catchAsync(
  async (req: Request, res: Response) => {
   const payload = req.body;

    const result = await DriverServices.createDriver(payload);

    sendResponse(res, {
      message: "Driver created successfully",
      success: true,
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  }
);

const getAllDrivers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DriverServices.getAllDriver();

    sendResponse(res, {
      message: "All drivers retrieved successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const getDriverById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as JwtPayload;

    const driver = await Driver.findById(id);
    if (user.email !== driver?.email.toString()) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Drivers can only access their own profile"
      );
    }

    const result = await DriverServices.getDriverById(id);

    if (!result) {
      throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
    }

    sendResponse(res, {
      message: "Driver retrieved successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const updateDriverAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; // This is userId (or driverId) from URL
    const user = req.user as JwtPayload;
    const { availability } = req.body;

    // Find the driver by userId or _id based on your routing logic
    const driver = await Driver.findOne({ userId: id });

    if (!driver) {
      throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
    }

    if (user.email !== driver.email.toString()) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Drivers can only update their own availability"
      );
    }

    const result = await DriverServices.updateDriverAvailability(
      id,
      availability
    );

    sendResponse(res, {
      message: "Driver availability updated successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);


const updateDriverStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    const result = await DriverServices.updateDriverStatus(id, approvalStatus);

    sendResponse(res, {
      message: "Driver status updated successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const getDriverRideHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as JwtPayload;

    if (user.userId !== id) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Drivers can only view their own ride history"
      );
    }

    const result = await DriverServices.getDriverRideHistory(id);

    sendResponse(res, {
      message: "Driver ride history retrieved successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const getDriverEarnings = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as JwtPayload;

    if (user.userId !== id) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Drivers can only view their own earnings"
      );
    }

    const result = await DriverServices.getDriverEarnings(id);

    sendResponse(res, {
      message: "Driver earnings retrieved successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const acceptRide = catchAsync(
  async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const user = req.user as JwtPayload;

    const result = await DriverServices.acceptRide(rideId, user.userId);

    sendResponse(res, {
      message: "Ride accepted successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const updateRideStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const { status } = req.body;
    const user = req.user as JwtPayload;

    const result = await DriverServices.updateRideStatus(
      rideId,
      user.userId,
      status
    );

    sendResponse(res, {
      message: "Ride status updated successfully",
      success: true,
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

export const DriverController = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriverAvailability,
  updateDriverStatus,
  getDriverRideHistory,
  getDriverEarnings,
  acceptRide,
  updateRideStatus,
};

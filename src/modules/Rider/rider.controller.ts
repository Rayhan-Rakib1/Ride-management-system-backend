import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RiderServices } from "./rider.services";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createRider = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await RiderServices.createRider(payload);
  sendResponse(res, {
    success: true,
    message: "Rider created successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getAllRiders = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.getAllRiders();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver data",
    data: result,
  });
});
const getRiderProfile = catchAsync(async (req: Request, res: Response) => {
  const {userId} = req.user as JwtPayload;
  const result = await RiderServices.getRiderProfile(userId as string );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver data",
    data: result,
  });
});
const updateRiderProfile = catchAsync(async (req: Request, res: Response) => {
  const {userId} = req.user as JwtPayload;
  const payload = req.body;
  const result = await RiderServices.updateRiderProfile(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver data",
    data: result,
  });
});
const getRiderHistory = catchAsync(async (req: Request, res: Response) => {
    const {userId} = req.user as JwtPayload;
  const result = await RiderServices.getRiderHistory(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver retrived",
    data: result,
  });
});
const getRiderById = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.params.id;
  const result = await RiderServices.getRiderById(riderId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver retrived",
    data: result,
  });
});
const deleteRiderAccountMe = catchAsync(async (req: Request, res: Response) => {
  const {userId} = req.user as JwtPayload;
  const result = await RiderServices.deleteRiderAccountMe(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver retrived",
    data: result,
  });
});
const deleteRiderAccountById = catchAsync(async (req: Request, res: Response) => {
  const  riderId = req.body;
  const result = await RiderServices.deleteRiderAccountById(riderId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All driver retrived",
    data: result,
  });
});

export const RiderController = {
  createRider,
  getAllRiders,
  getRiderProfile,
  updateRiderProfile,
  getRiderHistory,
  getRiderById,
  deleteRiderAccountMe,
  deleteRiderAccountById
};

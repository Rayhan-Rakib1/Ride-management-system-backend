import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { OTPServices } from "./otp.services";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  await OTPServices.sendOTP(name, email);
  sendResponse(res, {
    success: true,
    message: "OTP send successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});
const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const {  email, otp } = req.body;
  await OTPServices.verifyOTP( email, otp);
  await sendResponse(res, {
    success: true,
    message: "OTP verified successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};

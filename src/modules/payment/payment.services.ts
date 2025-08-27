/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import { Payment } from "./payment.model";
import { Ride } from "../ride/ride.model";
import { ISSLCormmerz } from "../sslCormmerz/sslCormerz.interface";
import { SSLServices } from "../sslCormmerz/sslCormerz.services";
import { PAYMENT_STATUS } from "./payment.interface";
import { RideStatus } from "../ride/ride.interface";

const initPayment = async (rideId: string) => {
  const payment = await Payment.findById({ rideId: rideId });
  if (!payment) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You are not create a ride");
  }

  const ride = await Ride.findById(payment.rideId);

  const riderAddress = (ride?.riderId as any).address;
  const riderEmail = (ride?.riderId as any).email;
  const riderPhoneNumber = (ride?.riderId as any).phone;
  const RiderName = (ride?.riderId as any).name;

  const sslPayload: ISSLCormmerz = {
    address: riderAddress,
    email: riderEmail,
    phoneNumber: riderPhoneNumber,
    name: RiderName,
    paymentAmount: payment.paymentAmount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLServices.sslPaymentInit(sslPayload);
  return { paymentUrl: sslPayment.GatewayPageURL };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      { transactionId: query.transactionId },
      { paymentStatus: PAYMENT_STATUS.completed },
      { runValidators: true, new: true, session: session }
    );

    if (!updatedPayment) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Payment not found");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      updatedPayment?.rideId,
      { status: RideStatus.Completed },
      { runValidators: true, new: true, session: session }
    )
      .populate("riderId", "name email")
      .populate("driverId", "name email");

    if (!updatedRide) {
      throw new AppError(401, "Ride not found");
    }

    await session.commitTransaction();
    session.endSession();
      return { success: true, message: "Payment successful" }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { paymentStatus: PAYMENT_STATUS.failed },
      { runValidators: true, new: true, session: session }
    );

    await Ride.findOneAndUpdate(
      updatedPayment?.rideId,
      { status: RideStatus.PaymentFailed },
      { runValidators: true, new: true, session: session }
    );

    await session.commitTransaction();
    session.endSession();
      return { success: false, message: "Payment failed" }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Ride.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      { transactionId: query.transactionId },
      { paymentStatus: PAYMENT_STATUS.cancelled },
      { runValidators: true, new: true, session: session }
    );

    await Ride.findByIdAndUpdate(
      updatedPayment?.rideId,
      { status: RideStatus.PaymentCancel },
      { runValidators: true, new: true, session: session }
    );

    await session.abortTransaction();
    session.endSession();
      return { success: false, message: "Payment Cancelled" }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};

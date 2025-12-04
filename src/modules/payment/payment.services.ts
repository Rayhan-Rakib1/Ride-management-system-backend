/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import { Payment } from "./payment.model";
import { Ride } from "../ride/ride.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { RideStatus } from "../ride/ride.interface";
import { SSLServices } from "../sslCormmerz/sslCormerz.services";
import { ISSLCormmerz } from "../sslCormmerz/sslCormerz.interface";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const initPayment = async (rideId: string) => {
  const transactionId = getTransactionId();

  const session = await Ride.startSession();
  session.startTransaction();

  try {
    // STEP-1: find ride
    const ride = await Ride.findById(rideId)
      .populate("driverId", "name email phone, address")
      .populate("riderId", "name email phone address");

    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, "Ride not found!");
    }

    if (!ride.riderId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Rider not found!");
    }

    // payment must happen only after ride completed
    if (ride.status !== RideStatus.Completed) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Payment is allowed only after ride completion"
      );
    }

    const rider: any = ride.riderId;

    if (!rider.phone || !rider.address) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please update your profile before making payment"
      );
    }

    // STEP-2: Create Payment Document
    const payment = await Payment.create(
      [
        {
          rideId: ride._id,
          amount: ride.fare,
          paymentStatus: PAYMENT_STATUS.pending,
          transactionId: transactionId,
          currency: ride.fare,
          riderId: rider,
        },
      ],
      { session }
    );

    // STEP-3: Update ride with payment ID
    const updatedRide = await Ride.findByIdAndUpdate(
      ride._id,
      { payment: payment[0]._id },
      { new: true, session }
    )
      .populate("riderId", "name email phone address")
      .populate("driverId", "name email phone")
      .populate("payment");

    // SSLCommerz payload
    const sslPayload: ISSLCormmerz = {
      name: rider.name,
      email: rider.email,
      phoneNumber: rider.phone,
      address: rider.address,
      paymentAmount: ride.fare,
      transactionId: transactionId,
    };

    console.log(sslPayload);

    // STEP-4: Init SSLCommerz
    const sslPaymentInit = await SSLServices.sslPaymentInit(sslPayload);

    // STEP-5: Update ride status
    await Ride.findByIdAndUpdate(
      ride._id,
      { status: RideStatus.PaymentSuccessful },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPaymentInit.GatewayPageURL,
      ride: updatedRide,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
    return { success: true, message: "Payment successful" };
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
    return { success: false, message: "Payment failed" };
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
    return { success: false, message: "Payment Cancelled" };
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

import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandler/AppError";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";
import { Role } from "../user/user.interface";
import { PaymentServices } from "../payment/payment.services";
import { Rider } from "../Rider/rider.model";

const createRide = async (payload: Partial<IRide>, riderEmail: string) => {
  const user = await User.findOne({email: riderEmail});
  const riderDoc = await Rider.findOne({email: riderEmail}).select("_id");
  const riderId = riderDoc?._id;

  if (!user || user.role !== Role.Rider) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is not a valid rider");
  }

  const activeRide = await Ride.findOne({
    riderId,
    status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
  });
  if (activeRide) {
    throw new AppError(StatusCodes.CONFLICT, "Rider already has an active ride");
  }

  const rideData: Partial<IRide> = {
    riderId,
    vehicle: payload.vehicle,
    pickup: payload.pickup,
    destination: payload.destination,
    status: RideStatus.Requested,
    duration: payload.duration,
    distance: payload.distance,
    fare: payload.fare,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ride = await Ride.create(rideData);
  return ride.populate("riderId", "name email");
};

const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (ride.riderId.toString() !== riderId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Rider can only cancel their own ride");
  }

  if (ride.status !== "requested") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Ride can only be cancelled before acceptance");
  }

  const result = await Ride.findByIdAndUpdate(
    rideId,
    {
      status: RideStatus.Cancelled,
      updatedAt: new Date(),
    },
    { new: true, runValidators: true }
  ).populate("riderId", "name email");

  return result;
};

const updateRideStatus = async (rideId: string, driverId: string, status: RideStatus) => {
  const driver = await Driver.findOne({ userId: driverId });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }

  if (driver.approvalStatus !== "approved") {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver is not approved");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (ride.driverId?.toString() !== driverId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver is not assigned to this ride");
  }

  const validStatusTransitions: Record<RideStatus, RideStatus[]> = {
    [RideStatus.Requested]: [RideStatus.Accepted],
    [RideStatus.Accepted]: [RideStatus.PickedUp],
    [RideStatus.PickedUp]: [RideStatus.InTransit],
    [RideStatus.InTransit]: [RideStatus.Completed],
    [RideStatus.Completed]: [],
    [RideStatus.Cancelled]: [],
    [RideStatus.PaymentFailed]: [],
    [RideStatus.PaymentCancel]: [],
    [RideStatus.PaymentSuccessful]: []
  };

  if (!validStatusTransitions[ride.status].includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Invalid status transition from ${ride.status} to ${status}`);
  }

  const updates: Partial<IRide> = {
    status,
    updatedAt: new Date(),
  };

  if (status === RideStatus.Completed) {
    updates.fare = ride.fare || 0; 
    await Driver.findOneAndUpdate(
      { userId: driverId },
      { $inc: { totalRides: 1, totalEarnings: updates.fare }, isAvailable: true, updatedAt: new Date() },
      { new: true }
    );
  }

  const result = await Ride.findByIdAndUpdate(rideId, updates, { new: true, runValidators: true }).populate(
    "riderId driverId",
    "name email"
  );

  return result;
};



export const getActiveRide = async (userId: string, email: string) => {

  const rider = await Rider.findOne({email: email})
  const riderId = rider?._id;
  // Find active ride for this user (rider)
  const ride = await Ride.findOne({
    riderId: riderId,
    status: { $ne: RideStatus.PaymentSuccessful }, // exclude payment success
  })
    .populate("riderId driverId", "name email phone");

  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "No active ride found");
  }

  return ride;
};





const getAllRides = async () => {
  const rides = await Ride.find().populate("riderId driverId", "name email").sort({ createdAt: -1 });
  return rides;
};


export const payment  = async (riderId: string) => {
  const ride = await Ride.findOne({
    riderId,
    status: { 
      $in: [
        RideStatus.Requested, 
        RideStatus.Accepted, 
        RideStatus.PickedUp, 
        RideStatus.InTransit,
        RideStatus.Completed // Completed add করলে payment দেখানো যাবে
      ]
    },
  })
    .populate("driverId", "name email phone")
    .populate("riderId", "name email phone");

  if (!ride) return null;

  let paymentUrl: string | null = null;

  if (ride.status === RideStatus.Completed) {
    try {
      const paymentResult = await PaymentServices.initPayment(ride._id.toString());
      paymentUrl = paymentResult.paymentUrl;
      if(paymentUrl){
        await Ride.updateOne(ride.riderId, {status: RideStatus.PaymentSuccessful})
      }
    } catch (err) {
      console.error("Payment init error:", err);
    }
  }

  return { ...ride.toObject(), paymentUrl };
};


export const RideServices = {
  createRide,
  cancelRide,
  updateRideStatus,
  getActiveRide,
  getAllRides,payment
};
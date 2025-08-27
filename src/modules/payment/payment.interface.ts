import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  pending = "PENDING",
  completed = "COMPLETED",
  failed = "FAILED",
  cancelled = "CANCELLED",
}



export interface IPayment {
  rideId: Types.ObjectId;
  riderId: Types.ObjectId;
  paymentAmount: number;
  currency: string;
  paymentStatus: PAYMENT_STATUS;
  transactionId: string;
  paymentGatewayData?: string;
  invoiceUrl?: string;
   paymentDate: Date;
}

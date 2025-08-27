import { IPayment, PAYMENT_STATUS } from "./payment.interface";
import { model, Schema } from "mongoose";

const paymentSchema = new Schema<IPayment>({
  rideId: {
    type: Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
    unique: true,
  },
  riderId: {
    type: Schema.Types.ObjectId,
    ref: "Rider",
    required: true,
    unique: true,
  },
  paymentAmount: { type: Number, require: true },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    required: true,
  },
  currency: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  paymentGatewayData: { type: Schema.Types.Mixed },
  invoiceUrl: { type: String },
  paymentDate: { type: Date, default: Date.now },
});

export const Payment = model<IPayment>("Payment", paymentSchema);

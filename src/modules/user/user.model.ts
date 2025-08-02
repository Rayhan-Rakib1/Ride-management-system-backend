import { Schema, model } from "mongoose";
import { IAuthProvider, IUser, Role, User_Status } from "./user.interface";

const authSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String},
    role: { type: String, enum: Object.values(Role), default: Role.Rider },
    status: {
      type: String,
      enum: Object.values(User_Status),
      default: User_Status.Active,
    },
    auth: [authSchema],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);

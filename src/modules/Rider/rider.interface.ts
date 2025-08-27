import { Types } from "mongoose";

export enum Rider_Status {
  Active = "Active",
  Blocked = "Blocked",
}

export interface IAuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export interface IRider {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  password?: string;
  role: "Rider";
  auth?: IAuthProvider[];
  status?: Rider_Status;
  address: string;
  phone: string;
  profileImage?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  nationality?: string;
}

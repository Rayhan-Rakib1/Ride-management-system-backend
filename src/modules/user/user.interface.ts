import { Types } from "mongoose";

export enum Role {
  SuperAdmin = "SUPER_ADMIN",
  Admin = "ADMIN",
  Rider = "RIDER",
  Driver = "DRIVER",
}

export enum User_Status {
  Active = "Active",
  Blocked = "Blocked",
}

export interface IAuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  password?: string;
  role: Role;
  profileImage: string
  auth?: IAuthProvider[];
  status?: User_Status;
}

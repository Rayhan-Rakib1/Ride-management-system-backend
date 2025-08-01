import { Types } from "mongoose";

export enum Role {
  SuperAdmin = "Super_Admin",
  Admin = "Admin",
  Rider = "Rider",
  Driver = "Driver",
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
  password?: string;
  role: Role;
  auth?: IAuthProvider[];
  status?: User_Status;
}

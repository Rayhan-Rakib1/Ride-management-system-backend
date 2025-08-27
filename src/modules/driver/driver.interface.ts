
export enum DriverApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Suspended = "suspended",
  Rejected = "rejected",
}

export enum DriverAvailability {
  Online = "online",
  Offline = "offline",
}

export interface IAuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export interface IDriver {
  name: string;
  email: string;
  password: string,
  isVerified?: boolean;
  isDeleted?: boolean; 
  auth: IAuthProvider[];
  role: string;
  approvalStatus: DriverApprovalStatus;
  availability: DriverAvailability;
  vehicleInfo: {
    vehicleType: "car" | "bike" | "van";
    number: string;
    color: string;
    model?: string;
    year?: number;
  };
  license: {
    number: string;
    expiryDate: Date;
  };
  currentLocation?: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  phone: string;
  profileImage?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  nationality?: string;
  rating?: number;
  totalRides: number;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

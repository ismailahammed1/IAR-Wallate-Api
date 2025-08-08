import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum AuthProviderType {
  GOOGLE = "google",
  CREDENTIAL = "credential",
}

export interface IAuthProvider {
  provider: AuthProviderType; //goole ,credintial
  providerID: string;
}
export enum userStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",

}

export interface Iuser {
     _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string; // Optional for backward compatibility
  name: string;
  email: string;
  password?: string;
  picture?: string;
  phone?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: isActive;
  role: Role;
  userStatus?: userStatus;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
  auths: IAuthProvider[];
  nationalId?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  approved?: boolean;
  commissionRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

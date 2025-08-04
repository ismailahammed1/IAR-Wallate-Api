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
  PENDING_AGENT_APPROVAL = "PENDING_AGENT_APPROVAL",
}

export interface Iuser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  phone?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: isActive;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
  auths: IAuthProvider[];
  userStatus?: userStatus;
  nationalId?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  role: Role;
  approved?: boolean; // For agents
  commissionRate?: number; // For agents
  createdAt?: Date;
  updatedAt?: Date;
}

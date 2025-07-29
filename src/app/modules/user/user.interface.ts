// user.interface.ts
import { Types } from "mongoose";

export enum Role {
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
  provider: AuthProviderType;
  providerID: string;
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

  auths: IAuthProvider[];
  role: Role;
  approved?: boolean; //  agents
  commissionRate?: number; //  agents
  createdAt?: Date;
  updatedAt?: Date;
}

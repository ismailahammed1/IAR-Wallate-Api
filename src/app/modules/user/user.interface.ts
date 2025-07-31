import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN="SUPER_ADMIN",
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
  approved?: boolean; // For agents
  commissionRate?: number; // For agents
  createdAt?: Date;
  updatedAt?: Date;
}

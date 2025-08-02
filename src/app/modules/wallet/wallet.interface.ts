import { Types } from "mongoose";
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  _id?: Types.ObjectId;
  user: Types.ObjectId; // ref: 'User'
  balance: number;
  status: AccountStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Types } from "mongoose";
export enum TransactionType {
  ADD_MONEY = "add_money",
  WITHDRAW = "withdraw",
  SEND_MONEY = "send_money",
  CASH_IN = "cash_in",
  CASH_OUT = "cash_out",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  type: TransactionType;
  from?: Types.ObjectId | null; // ref: 'User'
  to?: Types.ObjectId | null;   // ref: 'User'
  amount: number;
  fee?: number;
  commission?: number;
  initiatedBy: Types.ObjectId;  // ref: 'User'
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Types } from "mongoose";

export enum TransactionType {
  ADD = "ADD",
  SEND = "SEND",
  RECEIVE = "RECEIVE",
  WITHDRAW = "WITHDRAW",
}


export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  transactionId?: string;
  type: TransactionType;
  from?: Types.ObjectId | null;
  to?: Types.ObjectId | null;
  amount: number;
  fee?: number;
  commission?: number;
  initiatedBy: Types.ObjectId;
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

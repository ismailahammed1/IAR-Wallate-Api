import { Types } from "mongoose";

export enum TransactionType {
  ADD = "ADD",
  SEND = "SEND",
  RECEIVE = "RECEIVE",
  WITHDRAW = "WITHDRAW",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  transactionId?: string;
  transactionType: TransactionType;

  fromUser?: Types.ObjectId | null;
  toUser?: Types.ObjectId | null;
  fromAgent?: Types.ObjectId | string | null;
  toAgent?: Types.ObjectId | string | null;

  amount: number;
  fee?: number;
  commission?: number;

  initiatedBy?: Types.ObjectId;
  initiatedByUser?: Types.ObjectId | null;
  initiatedByAgent?: Types.ObjectId | null;

  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}


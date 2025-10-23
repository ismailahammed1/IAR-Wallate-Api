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
  transactionId: string; // Make this mandatory if it's generated
  transactionType: TransactionType;

  fromUser?: Types.ObjectId | null;
  toUser?: Types.ObjectId | null;
  fromAgent?: Types.ObjectId | null; // Optional if the transaction involves an agent
  toAgent?: Types.ObjectId | null; // Optional if the transaction involves an agent

  amount: number;
  fee?: number;
  commission?: number;

  initiatedByUser: Types.ObjectId;  // Can be either a user or an agent who initiated
  initiatedByAgent: Types.ObjectId;  // Can be either a user or an agent who initiated
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

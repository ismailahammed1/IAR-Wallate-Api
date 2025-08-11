import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      unique: true,
      default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },

    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    fromUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
    toUser: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // For Agents
    fromAgent: { type: Schema.Types.ObjectId, ref: "Agent", default: null },
    toAgent: { type: Schema.Types.ObjectId, ref: "Agent", default: null },


    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },

    initiatedByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    initiatedByAgent: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TransactionModel = model<ITransaction>(
  "Transaction",
  TransactionSchema
);

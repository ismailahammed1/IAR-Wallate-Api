import { Schema, model } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";



const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    from: { type: Schema.Types.ObjectId, ref: "User", default: null },
    to: { type: Schema.Types.ObjectId, ref: "User", default: null },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);

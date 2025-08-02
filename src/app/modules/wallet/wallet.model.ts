import { Schema, model } from "mongoose";
import { AccountStatus, IWallet } from "./wallet.interface";


const WalletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 50 },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export const WalletModel = model<IWallet>("Wallet", WalletSchema);

/* eslint-disable no-useless-catch */
import { WalletModel } from "./wallet.model"; // Assuming you have the Wallet model defined
import { AppError } from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { AccountStatus } from "./wallet.interface";
import { TransactionModel } from "../transaction/transaction.model";

const getWallet = async (userId: string) => {
try {
    const wallet = await WalletModel.findOne({ user: userId }).populate(
      "user",
      "name email role"
    );

  if (!wallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "No wallet found for this user.");
  }

  return wallet;
} catch (error) {
  throw (error)
}
};

 const getMyTransactions = async (
  userId: string,
  { limit = 10, page = 1 }: { limit: number; page: number }
) => {
  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { fromUser: userId },
      { toUser: userId },
      { initiatedByUser: userId },
    ],
  };

  const [transactions, total] = await Promise.all([
    TransactionModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("fromUser", "name email role")
      .populate("toUser", "name email role")
      .populate("initiatedByUser", "name email role"),
    TransactionModel.countDocuments(filter),
  ]);

  return {
    transactions,
    total,
    page,
    limit,
  };
};


const blockWallet = async (walletId: string) => {
try {
    const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  wallet.status = AccountStatus.BLOCKED;
  await wallet.save();
  return wallet;
} catch (error) {
  throw (error)
}
};

const unblockWallet = async (walletId: string) => {
try {
    const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  wallet.status = AccountStatus.ACTIVE;
  await wallet.save();
  return wallet;
} catch (error) {
  throw (error)
}
};


export const walletService = {
  getWallet,
  blockWallet,
  unblockWallet,
  getMyTransactions 

};

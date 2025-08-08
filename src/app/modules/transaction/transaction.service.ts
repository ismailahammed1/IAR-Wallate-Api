// src/modules/transaction/transaction.service.ts
import { WalletModel } from "../wallet/wallet.model";
import { TransactionModel } from "./transaction.model";
import { AppError } from "../../errorHelpers/AppError";
import { AccountStatus } from "../wallet/wallet.interface";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import { User } from "../user/user.model";


const addMoneyByUser = async (userId: string, amount: number) => {
    if (!userId || !amount || amount <= 0) {
    throw new AppError(400, "User ID and valid amount are required");
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  if (user.userStatus !== "APPROVED") {
    throw new AppError(403, "Only approved users can add money");
  }

  const wallet = await WalletModel.findOne({ user: userId });
  if (!wallet) throw new AppError(404, "Wallet not found");

  wallet.balance += amount;
  await wallet.save();

  const transaction =await TransactionModel.create({
  transactionType: TransactionType.ADD,
  amount,
  fromUser: userId,
  toUser: userId,
  initiatedByUser: userId,
  status: TransactionStatus.COMPLETED,
});


  return {
    message: "Money added successfully",
    newBalance: wallet.balance,
    transaction,
  };
};

const userTopUp = async (userId: string, amount: number) => {
  if (!userId || !amount || amount <= 0) {
    throw new AppError(400, "User ID and valid amount are required");
  }

  const userWallet = await WalletModel.findOne({ user: userId });

  if (!userWallet) {
    throw new AppError(404, "User wallet not found");
  }

  if (userWallet.status === AccountStatus.BLOCKED) {
    throw new AppError(403, "User wallet is blocked");
  }

  // Add money
  userWallet.balance += amount;
  await userWallet.save();

  // Save transaction
  await TransactionModel.create({
    type: TransactionType.ADD,
    fromUser: userId,
    toUser: userId,
    amount,
    initiatedByUser: userId,
    status: TransactionStatus.COMPLETED,
  });

  return {
    balance: userWallet.balance,
    amountAdded: amount,
  };
};


export const transactionSevice={
  addMoneyByUser,
  userTopUp,
}
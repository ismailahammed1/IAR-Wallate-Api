import { WalletModel } from './wallet.model';  // Assuming you have the Wallet model defined
import { AppError } from '../../errorHelpers/AppError';
import { StatusCodes } from 'http-status-codes';
import { AccountStatus } from './wallet.interface';

const getWallet = async (userId: string) => {
  // Find the wallet for the user
  const wallet = await WalletModel.findOne({ user: userId });

  if (!wallet) {
    // If no wallet is found for the user
    throw new AppError(StatusCodes.NOT_FOUND, 'No wallet found for this user.');
  }

  return wallet;
};


const blockWallet = async (walletId: string) => {
  const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  wallet.status = AccountStatus.BLOCKED; 
  await wallet.save();
  return wallet;
};

const unblockWallet = async (walletId: string) => {
  const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  wallet.status =AccountStatus.ACTIVE;
  await wallet.save();
  return wallet;
};

const addMoneyWallet = async (walletId: string, amount: number) => {
  const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  if (amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount must be greater than zero");
  }
  if (wallet.status !== AccountStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Cannot add money to a blocked or inactive wallet");
  }
  // Add the amount to the wallet balance
  if (wallet.balance === undefined) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is undefined");
  }
  if (typeof wallet.balance !== 'number') {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is not a number");
  }
  if (amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount cannot be negative");
  }
  if (wallet.balance + amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
  }

  wallet.balance += amount;
  await wallet.save();
  
  return wallet;
}

const withdrawMoneyWallet = async (walletId: string, amount: number) => {
  const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found"); 
  if (amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount must be greater than zero");
  }
  if (wallet.status !== AccountStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Cannot withdraw money from a blocked or inactive wallet");
  }
  if (wallet.balance === undefined) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is undefined");
  }
  if (typeof wallet.balance !== 'number') {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is not a number");
  }
  if (amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount cannot be negative");
  }
  if (wallet.balance - amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
  }
  // Subtract the amount from the wallet balance
  wallet.balance -= amount;
  await wallet.save();
  return wallet;
} 
 const sendMoneyWallet = async (fromWalletId: string, toWalletId: string, amount: number) => {
  const fromWallet = await WalletModel.findById(fromWalletId);  
  if (!fromWallet) throw new AppError(StatusCodes.NOT_FOUND, "Sender wallet not found");
  const toWallet = await WalletModel.findById(toWalletId);
  if (!toWallet) throw new AppError(StatusCodes.NOT_FOUND, "Receiver wallet not found");
  if (amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount must be greater than zero");
  }
  if (fromWallet.status !== AccountStatus.ACTIVE || toWallet.status !== AccountStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Cannot send money from/to a blocked or inactive wallet");
  }
  if (fromWallet.balance === undefined || toWallet.balance === undefined) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is undefined");
  }
  if (typeof fromWallet.balance !== 'number' || typeof toWallet.balance !== 'number') {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is not a number");
  }
  if (amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount cannot be negative");
  }
  if (fromWallet.balance - amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance in sender's wallet");
  }
  // Subtract the amount from the sender's wallet balance
  fromWallet.balance -= amount;
  // Add the amount to the receiver's wallet balance
  toWallet.balance += amount;
  await fromWallet.save();
  await toWallet.save();
  return { fromWallet, toWallet };
}

const cashInWallet = async (walletId: string, amount: number) => {
  const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found"); 
  if (amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount must be greater than zero");
  }
  if (wallet.status !== AccountStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Cannot cash in to a blocked or inactive wallet");
  }
  if (wallet.balance === undefined) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is undefined");
  }
  if (typeof wallet.balance !== 'number') {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is not a number");
  }
  if (amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount cannot be negative");
  }
  // Add the amount to the wallet balance
  wallet.balance += amount;
  await wallet.save();
  return wallet;
}
const cashOutWallet = async (walletId: string, amount: number) => {
  const wallet = await WalletModel.findById(walletId);
  if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  if (amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount must be greater than zero");
  }
  if (wallet.status !== AccountStatus.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Cannot cash out from a blocked or inactive wallet");
  }
  if (wallet.balance === undefined) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is undefined");
  }
  if (typeof wallet.balance !== 'number') {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Wallet balance is not a number");
  }
  if (amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Amount cannot be negative");
  }
  if (wallet.balance - amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
  }
  // Subtract the amount from the wallet balance
  wallet.balance -= amount;
  await wallet.save();
  return wallet;
}
export const walletService = { getWallet , blockWallet, unblockWallet, addMoneyWallet, withdrawMoneyWallet, sendMoneyWallet, cashInWallet, cashOutWallet };


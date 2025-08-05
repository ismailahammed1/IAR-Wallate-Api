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

export const walletService = { getWallet , blockWallet, unblockWallet };


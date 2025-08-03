import { WalletModel } from './wallet.model';  // Assuming you have the Wallet model defined
import { AppError } from '../../errorHelpers/AppError';
import { StatusCodes } from 'http-status-codes';

const getWallet = async (userId: string) => {
  // Find the wallet for the user
  const wallet = await WalletModel.findOne({ user: userId });

  if (!wallet) {
    // If no wallet is found for the user
    throw new AppError(StatusCodes.NOT_FOUND, 'No wallet found for this user.');
  }

  return wallet;
};

export const walletService = { getWallet };


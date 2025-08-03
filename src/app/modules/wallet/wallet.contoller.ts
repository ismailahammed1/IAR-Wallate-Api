
import { NextFunction, Request, Response } from "express";
import { WalletModel } from "./wallet.model";
import { AccountStatus } from "./wallet.interface";
import { catchAsync } from "../../utils/catchAsync";
import { walletService } from "./wallet.sevice";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { isValidObjectId } from "mongoose";

const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const userId = req.user?.userId; 
  
  if (!userId) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'User not found or not authenticated'));
  } 
  if (!userId) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'User not found or not authenticated'));
  }

  try {
    const wallet = await walletService.getWallet(userId);
    if (!wallet) {
      return next(new AppError(StatusCodes.NOT_FOUND, 'Wallet not found for this user'));
    }

     
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User retrieved wallet successfully',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
});



const blockOrUnblockWallet = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    if (!Object.values(AccountStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be one of: ACTIVE, INACTIVE, BLOCKED.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wallet ID format.",
      });
    }

    const updatedWallet = await WalletModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    res.json({
      success: true,
      message: `Wallet ${status.toLowerCase()} successfully.`,
      data: updatedWallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error),
    });
  }
};


export const walletContoller={
    blockOrUnblockWallet,
    getMyWallet
}
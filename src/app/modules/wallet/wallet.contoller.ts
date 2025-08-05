
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletService } from "./wallet.sevice";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";


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



const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
try {
      const { walletId } = req.params; 
      if (!walletId) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Wallet ID is required");
      }
    const wallet = await walletService.blockWallet(walletId);

    if (!wallet) {
      throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Wallet blocked successfully',
      data: wallet,
    });
} catch (error) {
    next(error);
  } 


});

const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 try {
  const { walletId } = req.params;
  if (!walletId) {  
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet ID is required");
  }
  const wallet = await walletService.unblockWallet(walletId);
  if (!wallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  }     
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wallet unblocked successfully',
    data: wallet,
  });
 } catch (error) {
    next(error);
 }
});

export const walletContoller={
    getMyWallet,
    blockWallet,
    unblockWallet,
}
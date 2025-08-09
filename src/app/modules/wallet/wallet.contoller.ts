/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletService } from "./wallet.sevice";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";



const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const loginUser = req.user as JwtPayload;
  const userId = loginUser.userId;

  if (!userId) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated'));
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

      const  walletId  = req.params.id; 
   
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

});

const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const walletId  = req.params.id;
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
});

export const walletContoller={
    getMyWallet,
    blockWallet,
    unblockWallet,
}


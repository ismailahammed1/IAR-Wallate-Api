/* eslint-disable @typescript-eslint/no-unused-vars */

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

const addMoneyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const walletId = req.params.id;
  const amount = req.body.amount; 
  try {
    const wallet = await walletService.addMoneyWallet(walletId, amount);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Money added to wallet successfully',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }

})
const withdrawMoneyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const walletId = req.params.id;
  const amount = req.body.amount; 
  try {
    const wallet = await walletService.withdrawMoneyWallet(walletId, amount);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Money withdrawn from wallet successfully',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
});
const cashInWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const walletId = req.params.id; 
  const amount = req.body.amount;
  try {
    const wallet = await walletService.cashInWallet(walletId, amount);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cash in to wallet successfully',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
});
const cashOutWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const walletId = req.params.id;   
  const amount = req.body.amount;
  try {
    const wallet = await walletService.cashOutWallet(walletId, amount);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cash out from wallet successfully',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
});
const sendMoneyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const fromWalletId = req.params.fromId; 
  const toWalletId = req.params.toId; 
  const amount = req.body.amount;
  try {
    const { fromWallet, toWallet } = await walletService.sendMoneyWallet(fromWalletId, toWalletId, amount);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Money sent successfully',
      data: { fromWallet, toWallet },
    });
  } catch (error) {
    next(error);
  }
}); 



export const walletContoller={
    getMyWallet,
    blockWallet,
    unblockWallet,
    addMoneyWallet,
    withdrawMoneyWallet,  
    cashInWallet,
    cashOutWallet,
    sendMoneyWallet,
}
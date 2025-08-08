/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { transactionSevice } from "./transaction.service";



const userAddMoney = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { amount } = req.body;

  const result = await transactionSevice.addMoneyByUser(user.userId, amount);

  res.status(200).json({
    success: true,
    message: result.message,
    balance: result.newBalance,
    transaction: result.transaction,
  });
});



const userTopUp = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { amount } = req.body;

  const result = await transactionSevice.userTopUp(user.id, amount);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Top-up successful",
    data: result,
  });
});


export const transactionContoller={
  userAddMoney,
  userTopUp,
}
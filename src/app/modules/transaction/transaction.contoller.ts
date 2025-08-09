/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { transactionSevice } from "./transaction.service";
import { AppError } from "../../errorHelpers/AppError";

const userAddMoney = catchAsync(async (req: Request, res: Response) => {
  const loginUser = req.user as JwtPayload;
  const userId=loginUser.userId
  const { amount } = req.body;

  const result = await transactionSevice.addMoneyByUser(userId, amount);

  res.status(200).json({
    success: true,
    message: result.message,
    balance: result.newBalance,
    transaction: result.transaction,
  });
});

const userTopUp = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const user = decodedToken.userId;
  const { amount } = req.body;

  const result = await transactionSevice.userTopUp(user, amount);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Top-up successful",
    data: result,
  });
});

const userWithdrawToAgent = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { agentId, amount } = req.body;

  if (!userId) {
    throw new AppError(401, "User not authenticated");
  }

  const result = await transactionSevice.userWithdrawToAgent(
    userId,
    agentId,
    amount
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Withdraw successful",
    data: result,
  });
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { receiverId, amount } = req.body;
  console.log(receiverId,amount, userId);
  const result = await transactionSevice.sendMoneyByUser(
    userId,
    receiverId,
    amount
  );

  

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});


// agent transactionContoller

export const agentCashIn = catchAsync(async (req: Request, res: Response) => {
  const agentId = (req.user as JwtPayload).userId;
  const { userId, amount } = req.body;

  const result = await transactionSevice.agentCashInToUser(agentId, userId, amount);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const agentCashOut = catchAsync(async (req: Request, res: Response) => {
  const agentId = (req.user as JwtPayload).userId;
  const { userId, amount } = req.body;

  const result = await transactionSevice.agentCashOutFromUser(agentId, userId, amount);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});


export const transactionContoller = {
  userAddMoney,
  userTopUp,
  userWithdrawToAgent,
  sendMoney,
  agentCashIn,
  agentCashOut,
};

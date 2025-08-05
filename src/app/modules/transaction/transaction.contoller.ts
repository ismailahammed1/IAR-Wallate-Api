import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { transactionService } from "./transaction.service";
import { AppError } from "../../errorHelpers/AppError";


const getAgentTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const transactions = await transactionService.getAgentTransactions(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Transactions retrieved successfully",
    data: transactions,
  });
});

export const transactionController = {
  getAgentTransactions,
};

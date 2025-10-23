/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { NextFunction, Request, Response,  } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";
import { transactionService } from "./transaction.service";

const userAddMoney = catchAsync(async (req: Request, res: Response, next:NextFunction ) => {
  const loginUser = req.user as JwtPayload;
  const userId=loginUser.userId
  const { agentId, amount } = req.body;

  const result = await transactionService.addMoneyByUser(userId, amount, agentId);

  res.status(200).json({
    success: true,
    message: result.message,
    balance: result.newBalance,
    transaction: result.transaction,
  });
});


const userWithdrawToAgent = catchAsync(async (req: Request, res: Response, next:NextFunction ) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { agentId, amount } = req.body;

  if (!userId) {
    throw new AppError(401, "User not authenticated");
  }

  const result = await transactionService.userWithdrawToAgent(
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

const sendMoney = catchAsync(async (req: Request, res: Response, next:NextFunction ) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { receiverId, amount } = req.body;
  const result = await transactionService.sendMoneyByUser(
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



export const agentCashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const agentId = (req.user as JwtPayload).userId;       // ensure your auth middleware sets this
  const { userId, amount } = req.body;

  const result = await transactionService.agentCashInToUser(agentId, userId, amount);
  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: {
      newUserBalance: result.newUserBalance,
      newAgentBalance: result.newAgentBalance,
      transaction: result.transaction,
    },
  });
});

export const agentCashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const agentId = (req.user as JwtPayload).userId;
  const { userId, amount } = req.body;

  const result = await transactionService.agentCashOutFromUser(agentId, userId, amount);
  res.status(StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: {
      newUserBalance: result.newUserBalance,
      newAgentBalance: result.newAgentBalance,
      transaction: result.transaction,
    },
  });
});



const getUserTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && user.role !== Role.USER) {
      return next(new AppError(403, "Only users or admins can access user transactions"));
    }

    const transactions = await transactionService.getUserTransactions(req.query);

    res.status(200).json({
      success: true,
      message: "User transactions fetched successfully",
      data: transactions,
    });
  }
);




const getAgentTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && user.role !== Role.AGENT) {
      return next(new AppError(403, "Only agents or admins can access agent transactions"));
    }

    const transactions = await transactionService.getAgentTransactions(req.query);

    res.status(200).json({
      success: true,
      message: "Agent transactions fetched successfully",
      data: transactions,
    });
  }
);




const getAllTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      return next(new AppError(403, "Only admins can access transactions"));
    }

    const transactions = await transactionService.getAllTransactions(req.query);

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      ...transactions,
    });
  }
);

 const getMyTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const role = user.role;

    if (role === Role.USER) {
      const result = await transactionService.getUserOwnTransactions(req.query, userId);
      return res.status(200).json({
        success: true,
        message: "User transactions fetched successfully",
        data: result,
      });
    }

    if (role === Role.AGENT) {
      const result = await transactionService.getAgentOwnTransactions(req.query, userId);
      return res.status(200).json({
        success: true,
        message: "Agent transactions fetched successfully",
        data: result,
      });
    }

    throw new AppError(403, "Only users or agents can access this route");
  }
);

export const transactionContoller = {
  userAddMoney,
getAllTransactions,
  userWithdrawToAgent,
  sendMoney,
  agentCashIn,
  agentCashOut,
getMyTransactions,
  getAgentTransactions,
  getUserTransactions
};

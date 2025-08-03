/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { WalletModel } from "../wallet/wallet.model";
import { AccountStatus } from "../wallet/wallet.interface";

const userRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userWithoutWallet = await UserServices.createUser({
      ...req.body,
      wallet: undefined,
    });

    const wallet = await WalletModel.create({
      user: userWithoutWallet._id,
      balance: 50,
      status: AccountStatus.ACTIVE,
    });


    userWithoutWallet.wallet = wallet._id as any;

    await userWithoutWallet.save();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User and Wallet created successfully",
      data: userWithoutWallet,
    });
  }
);



const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await UserServices.getAllUser(page, limit);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const newUpdatedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await UserServices.userUpdated(
      userId,
      payload,
      verifiedToken as JwtPayload
    ); // ✅ Add await

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: user,
    });
  }
);

export default {
  userRegister,
  getAllUser,
  newUpdatedUser,
};

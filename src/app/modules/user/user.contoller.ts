/* eslint-disable no-useless-catch */
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
import { Iuser, Role } from "./user.interface";



const userRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   try {
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
  
   } catch (error) {
    throw (error)
   }
});



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

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload


    const result = await UserServices.getMe(decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

const newUpdatedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await UserServices.userUpdated(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: user,
    });
  }
);

const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const name = req.query.name?.toString() || "";
  const requestedRoles = req.query.roles?.toString().split(",") || [];

const currentUser = req.user as Iuser;
  

  let rolesToSearch: string[] = [];


if (!currentUser) {
  return res.status(401).json({ message: "Unauthorized" });
}
const userId = currentUser._id?.toString();

switch (currentUser.role) {
  case Role.ADMIN:
  case Role.SUPER_ADMIN:
    rolesToSearch = requestedRoles.length ? requestedRoles : [Role.USER, Role.AGENT];
    break;
  case Role.AGENT:
    rolesToSearch = [Role.USER, Role.AGENT];
    break;
  case Role.USER:
  default:
   rolesToSearch = [Role.USER, Role.AGENT];
    break;
}

  const users = await UserServices.searchUsers(name, rolesToSearch, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});



export default {
  userRegister,
  getAllUser,
  newUpdatedUser,
  getMe,
  getSingleUser,
searchUsers

};

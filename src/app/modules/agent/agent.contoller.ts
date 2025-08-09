/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AgentService } from "./agent.service";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelpers/AppError";
import { WalletModel } from "../wallet/wallet.model";
import { AccountStatus } from "../wallet/wallet.interface";


const agentRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
 try {
    
     const agentWithoutWallet = await AgentService.agentCreate({
      ...req.body,
      wallet: undefined,
    });

    const wallet = await WalletModel.create({
      user: agentWithoutWallet._id,
      balance: 50,
      status: AccountStatus.ACTIVE,
    });


    agentWithoutWallet.wallet = wallet._id as any;

    await agentWithoutWallet.save();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "agent and Wallet created successfully",
      data: agentWithoutWallet,
    });
  
 } catch (error) {
  throw (error)
 }
  
});





export const agentContoller = {
  agentRegister,
};
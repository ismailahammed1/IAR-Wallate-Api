/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";

const credentialLoging = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credintialsLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Login successful",
      data: loginInfo,
    });
  }
);

export const AuthController = {
  credentialLoging,
};

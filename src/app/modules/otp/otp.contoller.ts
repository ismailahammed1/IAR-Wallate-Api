/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../../errorHelpers/AppError";
import { OTPService } from "./otp.service";

const sendOtpHandler = catchAsync(async (req, res) => {
  const { email , name} = req.body;
  await OTPService.sendOTP(email, name);

 sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'OTP sent successfully!',
    data: null,
  });
});

const verifyOtpHandler = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const isValid = await OTPService.verifyOTP(email, otp);

  if (!isValid) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'OTP verified successfully!',
    data: null,
  });
});

 export const otpContoller={
    sendOtpHandler,
    verifyOtpHandler,
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const sendOtp=catchAsync(async (req: Request, res: Response, next:NextFunction ) =>{
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "message",
    data: null,
  })
    
})

const verifyOtp=catchAsync(async (req: Request, res: Response, next:NextFunction ) =>{
    console.log("hello verifyOtp");
})


export const otpContoller = {
    sendOtp,
    verifyOtp
}
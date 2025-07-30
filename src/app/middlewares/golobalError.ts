/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errorHelpers/AppError";
import { envVars } from "../config/envVars";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // Check for AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }


  res.status(statusCode).json({
        success: false,
        message,
        err: envVars.NODE_ENV === "Development" ? error : null,
        stack: envVars.NODE_ENV === "Development" ? error.stack : null
  });
};

export default globalErrorHandler;

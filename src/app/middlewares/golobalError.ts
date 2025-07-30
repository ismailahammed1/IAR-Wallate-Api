/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/middlewares/globalErrorHandler.ts

import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/envVars";
import { AppError } from "../errorHelpers/AppError";


const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    details: error.details || null,
    stack: envVars.NODE_ENV === "Development" ? error.stack : undefined,
  });
};

export default globalErrorHandler;

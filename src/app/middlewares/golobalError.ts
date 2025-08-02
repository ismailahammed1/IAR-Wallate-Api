/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errorHelpers/AppError";
import { envVars } from "../config/envVars";
import { TErrorSources } from "../interface/error.types";
import { DuplicateErrorHandler } from "../helpers/DuplicateError";
import { ValidationErrorHandler } from "../helpers/ValidationError";
import { ZodErrorHandler } from "../helpers/ZodError";
import { CastErrorHandler } from "../helpers/CastError";


const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

    if (envVars.NODE_ENV === "Development") {
        console.log(err);
    }
  

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError =DuplicateErrorHandler(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError =CastErrorHandler(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = ZodErrorHandler(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = ValidationErrorHandler(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

  res.status(statusCode).json({
        success: false,
        message,
        err: envVars.NODE_ENV === "Development" ? err : null,
        stack: envVars.NODE_ENV === "Development" ? err.stack : null
  });
};

export default globalErrorHandler;

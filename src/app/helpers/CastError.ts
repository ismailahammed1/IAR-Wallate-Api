/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interface/error.types"

export const CastErrorHandler = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id"
    }
}
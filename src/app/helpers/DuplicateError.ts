/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse } from "../interface/error.types"


export const DuplicateErrorHandler = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    }
}
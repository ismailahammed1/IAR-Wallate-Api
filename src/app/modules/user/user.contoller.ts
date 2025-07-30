
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services";
import { catchAsync } from "../../middlewares/checkAuth";
import { sendResponse } from "../../utils/sendResponse";

const userRegister = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
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
});


export default { userRegister, getAllUser };

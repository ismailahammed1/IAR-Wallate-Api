/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; 
import { UserServices } from "./user.services";

const userRegister = async (req: Request, res: Response) => {
  try {
    const user=await UserServices.createUser(req.body)

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Something went wrong: ${error.message}`,
      error,
    });
  }
};

export default { userRegister };

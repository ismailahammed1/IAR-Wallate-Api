import { NextFunction, Request, Response } from "express";
import { AppError } from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { envVars } from "../config/envVars";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { isActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
const rawAuthHeader =
  req.headers.authorization || req.cookies.accessToken;

if (
  !rawAuthHeader ||
  typeof rawAuthHeader !== "string" ||
  (!rawAuthHeader.startsWith("Bearer ") && !req.cookies.accessToken)
) {
  throw new AppError(StatusCodes.FORBIDDEN, "No Token Received");
}

const token = rawAuthHeader.startsWith("Bearer ")
  ? rawAuthHeader.split(" ")[1]
  : rawAuthHeader; 


      const verifiedToken = verifyToken(
        token,
        envVars.jwt_secret
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
      }
      if (
        isUserExist.isActive === isActive.BLOCKED ||
        isUserExist.isActive === isActive.INACTIVE
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are not permitted to view this route!!!"
        );
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      // console.log("jwt error", error);
      next(error);
    }
  };

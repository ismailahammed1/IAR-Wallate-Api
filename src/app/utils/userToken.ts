// src/app/modules/auth/jwt.ts (continued)
import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/envVars";
import { AppError } from "../errorHelpers/AppError";
import { isActive, Iuser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = (user: Partial<Iuser>) => {
  if (!user || !user._id) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "User ID is missing");
  }

  // Handle ObjectId or string _id safely
  const userId =
    typeof user._id === "string" ? user._id : (user._id as Types.ObjectId).toString();

  const jwtPayload: JwtPayload & {
    userId: string;
    email: string;
    role: Role;
  } = {
    userId,
    email: user.email as string,
    role: user.role as Role,
  };

  const accessToken = generateToken(jwtPayload, envVars.jwt_secret, envVars.jwt_Expired);
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRETS, envVars.JWT_REFRESH_EXPIRES);

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRETS) as JwtPayload & {
    email: string;
  };

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  if (isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE) {
    throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }

  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload: JwtPayload & {
    userId: string;
    email: string;
    role: Role;
  } = {
    userId: isUserExist._id.toString(), 
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.jwt_secret, envVars.jwt_Expired);
  return accessToken;
};
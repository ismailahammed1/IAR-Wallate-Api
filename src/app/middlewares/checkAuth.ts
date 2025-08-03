import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/envVars";


export const checkAuth = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "No token provided");
      }
      let token: string;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader;
      }
      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "No token provided");
      }
      const decoded = jwt.verify(token, envVars.jwt_secret) as JwtPayload & {
        userId: string;
        role: string;
      };

      if (!decoded.userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized: No user ID in token");
      }

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      } as { userId: string; role: string };

      if (!allowedRoles.includes(decoded.role)) {
        throw new AppError(StatusCodes.FORBIDDEN, "Forbidden: You don't have permission");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

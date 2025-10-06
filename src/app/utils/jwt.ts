/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { AppError } from "../errorHelpers/AppError";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (err: any) {
    console.error("Token verification failed:", err.message);
    throw new AppError(401, "Invalid or expired token");
  }
};
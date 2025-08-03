
import { AppError } from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";

import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs'
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";
import { StatusCodes } from "http-status-codes";


const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};



const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

  const user = await User.findById(decodedToken.userId);
if (!user) {
   throw new AppError(StatusCodes.NOT_FOUND, "User not found")
}

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password does not match");
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    await user.save();


}
const resetPassword = async (payload: { newPassword: string }, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user.password = hashedPassword;
  await user.save();
};



const setPassword = async (newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is already set. Use change-password instead.");
  }

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user.password = hashedPassword;
  await user.save();
};

export const authServices = {
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
};
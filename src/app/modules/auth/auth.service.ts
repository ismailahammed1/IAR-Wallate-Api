
import { AppError } from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";

import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs'
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";


const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};

const resetPassword = async (payload: { newPassword: string; id: string }, decodedToken: JwtPayload) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(403, "You are not authorized to reset this password");
  }

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

export const authServices = {
  getNewAccessToken,
  resetPassword,
};
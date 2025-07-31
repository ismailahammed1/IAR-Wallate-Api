import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userToken";
import { Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs'

const credintialsLogin = async (payload: Partial<Iuser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user Already Exist");
  }
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "password incorect");
  }
  const userToken = createUserTokens(isUserExist);

  const userObj = isUserExist.toObject();
  delete userObj.password;
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    users: userObj,
  };
};


export const authServices={

    credintialsLogin
}
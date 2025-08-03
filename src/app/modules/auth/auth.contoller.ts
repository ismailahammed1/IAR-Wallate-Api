/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { AppError } from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";
import { createUserTokens } from "../../utils/userToken";
import passport from "passport";
import { Iuser } from "../user/user.interface";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(401, err))
        }

        if (!user) {
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()

        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)

})

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Refresh token is missing");
    }

    const tokenInfo = await authServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Access token refreshed",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Logged out successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await authServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    await authServices.resetPassword(req.body, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password reset successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newPassword = req.body.newPassword;
  const decodedToken = req.user;

  await authServices.setPassword(newPassword, decodedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password set successfully",
    data: null,
  });
});


const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = (req.query.state as string) || "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1) }
    const user = req.user;
 
    if (!user) {
      return next(new AppError(StatusCodes.NOT_FOUND, "User not found"));
    }

    const userTokens = createUserTokens(user as Partial<Iuser>);
    setAuthCookie(res, userTokens);

    const redirectUrl = `${envVars.FRONT_END_URL}/home${redirectTo.replace(/^\//, "")}`;
    res.redirect(redirectUrl);
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController, 
  changePassword,
  setPassword,
};
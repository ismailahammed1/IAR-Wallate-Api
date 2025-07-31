import { StatusCodes } from "http-status-codes"
import { envVars } from "../config/envVars"
import { AppError } from "../errorHelpers/AppError"
import { isActive, Iuser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import { generateToken, verifyToken } from "./jwt"
import { JwtPayload } from "jsonwebtoken"

export const createUserTokens = (user: Partial<Iuser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVars.jwt_secret, envVars.jwt_Expired)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRETS, envVars.JWT_REFRESH_EXPIRES)


    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRETS,
    ) as JwtPayload;

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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(jwtPayload, envVars.jwt_secret, envVars.jwt_Expired);
    return accessToken;
};

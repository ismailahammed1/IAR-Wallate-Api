import { Response } from "express";
import { envVars } from "../config/envVars";


export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "Production",
            sameSite: "none"
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "Production",
            sameSite: "none"
        })
    }
}
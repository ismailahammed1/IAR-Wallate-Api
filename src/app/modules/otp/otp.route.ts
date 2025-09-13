
import { Router } from "express";
import { otpContoller } from "./otp.contoller";

const router=Router()
router.post("/sendotp", otpContoller.sendOtpHandler)
router.post("/verifyotp", otpContoller.verifyOtpHandler)

export const otpRoutes=router
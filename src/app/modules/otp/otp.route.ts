
import { Router } from "express";
import { otpContoller } from "./otp.contoller";

const router=Router()
router.post("/sendotp", otpContoller.sendOtp)
router.post("/verifyotp", otpContoller.verifyOtp)

export const otpRoutes=router
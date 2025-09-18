import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import { AppError } from "../../errorHelpers/AppError";
import { userStatus } from "../user/user.interface";


const OTP_EXPIRATION = 2 * 60 // 2minute

const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000

    return otp
}

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError(404, "User not found");
  // if (user.isVerified) throw new AppError(401, "You are already verified");

  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: { name, otp },
  });

};

const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);
  console.log('Saved OTP from Redis:', savedOtp);

if (!savedOtp || savedOtp !== String(otp)) {
  throw new AppError(401, "Invalid OTP");
}

  // ✅ Automatically approve and verify user
  user.isVerified = true;
  user.approved = true;
  user.userStatus = userStatus.APPROVED;

  await user.save();
  await redisClient.del(redisKey);

  return true;
};


export const OTPService = {
    sendOTP,
    verifyOTP
}
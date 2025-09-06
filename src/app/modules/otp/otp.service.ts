import crypto from 'crypto';
import { redisClient } from '../../config/redis.config';

OTP-EXPERETION=2*60//2min experation

const genaretOtp=async(langth=6)=>{
    const Otp=crypto.randomInt(10**(langth-1), 10**langth).toString()
    return Otp
}
const sendOtp=async(email:string, name:string)=>{
    const otp=genaretOtp()
    const redisKey=`otp:${email}`
    await redisClient.set(redisKey,otp,Option{
        expiration:{
            type:'EX',
            value:otp-EXPERETION
        }
    })
}

const verifyOtp=async()=>{

}
export const otpServices={
    sendOtp,
    verifyOtp
}
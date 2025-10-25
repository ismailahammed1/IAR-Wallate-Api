/* eslint-disable @typescript-eslint/no-unused-vars */

import { AppError } from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";

import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs'
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";
import { StatusCodes } from "http-status-codes";
import { isActive, Iuser, Role, userStatus } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";


const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};



const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  //  Check if old password matches
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Old password does not match"
    );
  }

  //  Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "New password and confirmation do not match"
    );
  }

  //  Hash and update new password
  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user.save();
};



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




const forgotPassword = async (email: string ,name:string) => {
  const user = await User.findOne({ email }) as (Iuser & Document) | null;

  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  if (!user.isVerified) throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified");

  const resetToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    envVars.jwt_secret,
    { expiresIn: "10m" }
  );

  const resetUILink = `${envVars.FRONT_END_URL}/reset-password?id=${user._id}&token=${resetToken}`;

  const html = `
    <h1>Password Reset Request</h1>
    <p>Hello ${user.name},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUILink}">${resetUILink}</a>
    <p>This link will expire in 10 minutes.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html,
  });
};

const approveAgentAndUserRequest = async (userId: string, verifiedToken: JwtPayload) => {
//  const verifiedROle=verifiedToken.role
  // console.log("veri", verifiedROle);
 
  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(verifiedToken.role)) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to approve agent requests");
  }

  // First try Agent
  let user = await User.findById(userId);
  if (!user) {
    // Try User
    user = await User.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
  }

  if ((user.role !== Role.AGENT && user.role !== Role.USER )|| user.userStatus !== userStatus.PENDING) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Only pending agents can be approved");
  }

  user.userStatus = userStatus.APPROVED;
  user.approved = true;
  user.isVerified = true;

  await user.save();

  return user;
};

 const suspendAgentRequest = async (id: string) => {
  const agent = await User.findById(id);
  if (!agent) {
    throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
  }
  agent.userStatus = userStatus.SUSPENDED;
    agent.isActive = isActive.INACTIVE; 
  await agent.save();
  return agent;
};

export const authServices = {
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  approveAgentAndUserRequest,
  suspendAgentRequest,
  forgotPassword
};
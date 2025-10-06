/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";
import { AppError } from "../../errorHelpers/AppError";
import { IAuthProvider, Iuser, AuthProviderType, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Agent } from "../agent/agent.model";
import { IAgent } from "../agent/agent.interface";

const createUser = async (payload: Partial<Iuser>) => {
  const { name, email, password, role = Role.USER, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const isUserExist =
    (await User.findOne({ email })) || (await Agent.findOne({ email }));
  if (isUserExist) {
    throw new AppError(409, "User with this email already exists ");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: AuthProviderType.CREDENTIAL,
    providerID: email,
  };

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUser = async (page = 1, limit = 1) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({}).skip(skip).limit(limit),
    User.countDocuments({}),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};
const getMe = async (userId: string) => {
  const user =
    (await User.findById(userId).select("-password")) ||
    (await Agent.findById(userId).select("-password"));
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return {
    data: user,
  };
};

const userUpdated = async (
  userId: string,
  payload: Partial<Iuser & IAgent>,
  decodedToken: JwtPayload
) => {
  // Use Set for faster & .includes()-free lookup
  const allowedSelfUpdateFieldsSet = new Set([
    "name",
    "password",
    "picture",
    "phone",
    "address",
    "nationalId",
    "profileImage",
    "dateOfBirth",
  ]);

  const ifUserExist =
    (await User.findById(userId)) || (await Agent.findById(userId));

  if (!ifUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Self-update restriction
  if (
    (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) &&
    userId !== decodedToken.userId
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  // Admin cannot update SUPER_ADMIN
  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to update SUPER_ADMIN"
    );
  }

  //  allowed fields (for USER / AGENT)
  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
    Object.keys(payload).forEach((key) => {
      if (!allowedSelfUpdateFieldsSet.has(key)) {
        delete payload[key as keyof typeof payload];
      }
    });

    // Restricted fields for user and agent
    if (
      "role" in payload ||
      "email" in payload ||
      "isActive" in payload ||
      "isDeleted" in payload ||
      "isVerified" in payload
    ) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update these fields"
      );
    }
  }

  // Decide which model to update
  const isUser = ifUserExist instanceof User;
  const newUpdatedUser = isUser
    ? await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
      })
    : await Agent.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
      });

  return newUpdatedUser;
};

export const UserServices = {
  createUser,
  getAllUser,
  userUpdated,
  getMe,
  getSingleUser,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";
import { AppError } from "../../errorHelpers/AppError";
import { IAuthProvider, Iuser, AuthProviderType, Role, userStatus, isActive, UserQueryParams } from "./user.interface";
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Agent, User } from "./user.model";
import { TransactionModel } from "../transaction/transaction.model";


const createUser = async (payload: Partial<Iuser>) => {
  const { name, email, password, role = Role.USER, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }
    const normalizedEmail = email.toLowerCase();


  const isUserExist =
    await User.findOne({ email })
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
if (![Role.USER, Role.AGENT].includes(role)) {
    throw new AppError(400, `Invalid role: ${role}`);
  }

  // Create user/agent
  const newUser = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    auths: [authProvider],
    ...rest,
  });

  return newUser;
};


const getAllUser = async () => {
  const totalUsers = await User.countDocuments({ role: Role.USER });
  const totalAgents = await User.countDocuments({ role: Role.AGENT });
  const transactionCount = await TransactionModel.countDocuments();

  const volumeByType = await TransactionModel.aggregate([
  {
    $group: {
      _id: "$transactionType",
      total: { $sum: "$amount" },
    },
  },
]);

// Initialize with all types and default to 0
const transactionVolume = {
  ADD: 0,
  SEND: 0,
  RECEIVE: 0,
  WITHDRAW: 0,
  CASH_IN: 0,
  CASH_OUT: 0,
};

for (const record of volumeByType) {
  const type = record._id as keyof typeof transactionVolume;
  transactionVolume[type] = record.total;
}

return {
  totalUsers,
  totalAgents,
  transactionCount,
  transactionVolume,
};

};


const getSingleUser = async (email: string) => {
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

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
  payload: Partial<Iuser>,
  decodedToken: JwtPayload
) => {
  try {
    const allowedSelfUpdateFieldsSet = new Set([
      "name",
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

    if (
      (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) &&
      userId !== decodedToken.userId
    ) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }

    if (
      decodedToken.role === Role.ADMIN &&
      ifUserExist.role === Role.SUPER_ADMIN
    ) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "You are not authorized to update SUPER_ADMIN"
      );
    }

    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      Object.keys(payload).forEach((key) => {
        if (!allowedSelfUpdateFieldsSet.has(key)) {
          delete payload[key as keyof typeof payload];
        }
      });

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
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Update failed. See logs.");
  }
};

const searchUsers = async (
  keyword: string,
  roles: string[],
  excludeUserId?: string
): Promise<Partial<Iuser>[]> => {
  const regex = { $regex: keyword, $options: "i" };

  const filter: any = {
    $or: [
     { name: regex },
    { email: regex },
    { role: regex }
    ],
      role: { $in: roles },
  };

  if (excludeUserId) {
    filter._id = { $ne: excludeUserId };
  }

  const users = await User.find(filter).select("_id name email role");

  return users;
};
const getUsers = async () => {
  return await User.find({ role: Role.USER }).select("-password");
};

const getAgents = async () => {
  return await User.find({ role: Role.AGENT }).select("-password");
};

const blockOrUnblockUser = async (id: string, action: "block" | "unblock") => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  if (action === "block") {
    user.isActive = isActive.BLOCKED;
  } else if (action === "unblock") {
    user.isActive = isActive.ACTIVE;
  } else {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid action");
  }

  await user.save();
  return user;
};

const approveAgent = async (id: string) => {
  const agent = await User.findById(id);
  if (!agent) throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
  if (agent.role !== Role.AGENT) throw new AppError(StatusCodes.BAD_REQUEST, "Not an agent");

  agent.userStatus = userStatus.APPROVED;
  agent.isVerified = true;
  agent.approved = true;

  await agent.save();
  return agent;
};

const suspendAgent = async (id: string) => {
  const agent = await User.findById(id);
  if (!agent) throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
  if (agent.role !== Role.AGENT) throw new AppError(StatusCodes.BAD_REQUEST, "Not an agent");

  agent.userStatus = userStatus.SUSPENDED;
  agent.isActive = isActive.INACTIVE;

  await agent.save();
  return agent;
};


export const UserServices = {
  createUser,
  getAllUser,
  userUpdated,
  getMe,
  getSingleUser,
  searchUsers,

    getUsers,
  getAgents,
  blockOrUnblockUser,
  approveAgent,
  suspendAgent,
};

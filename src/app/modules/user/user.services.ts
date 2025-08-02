
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envVars";
import { AppError } from "../../errorHelpers/AppError";
import { IAuthProvider, Iuser, AuthProviderType, Role, } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from 'bcryptjs'
import { StatusCodes } from "http-status-codes";

const createUser = async (payload: Partial<Iuser>) => {
  const { name, email, password, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(409, "User with this email already exists");
  }

  const hashedPassword=await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
  // const isPaswordMatch= await bcryptjs.compare(password as string, hashedPassword)

  
  const authProvider: IAuthProvider = {
    provider: AuthProviderType.CREDENTIAL,
    providerID: email,
  };

  const user = await User.create({
    name,
    email,
    password:hashedPassword,
   ...rest,
    auths: [authProvider],
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

const userUpdated=async(userId: string, payload: Partial<Iuser>, decodedToken: JwtPayload)=>{
         
  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(StatusCodes.NOT_FOUND, "User Not Found")
    }

    if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }
       if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
        }

      if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
    }
    
  
}

export const UserServices = {
  createUser,
  getAllUser,
  userUpdated,
};

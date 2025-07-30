import { AppError } from "../../errorHelpers/AppError";
import { Iuser } from "./user.interface";
import { User } from "./user.model";


const createUser=async(payload:Partial<Iuser>)=>{
    const { email, password ,}=payload;

    const isUserExist=await User.findOne({email})
    if (isUserExist) {
        throw new AppError("User with this email already exists", 409);

    }
    const user=await User.create({
        email,
        password,
    })
    
 
    return user
}

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


export const UserServices={
    createUser,
    getAllUser,
} 
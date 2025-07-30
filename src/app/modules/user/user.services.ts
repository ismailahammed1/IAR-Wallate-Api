import { Iuser } from "./user.interface";
import { User } from "./user.model";


const createUser=async(payload:Partial<Iuser>)=>{
    const { email, password ,}=payload;
//      if (!email || !password || !name || !phone) {
//     throw new Error("Name, email, phone, and password are required");
//   }
    const isUserExist=await User.findOne({email})
    if (!isUserExist) {
        throw new Error("User with this email already exists");
    }
    const user=await User.create({
        // name,
        email,
        password,
        // phone
    })
    
 
    return user
}
export const UserServices={
    createUser,
} 
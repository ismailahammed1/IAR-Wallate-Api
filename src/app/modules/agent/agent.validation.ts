
// import { z } from "zod";
// import { isActive, userStatus } from "../user/user.interface";



// export const agentCreateSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().email(),
//   password: z.string().min(6),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   nationalId: z.string().optional(),
//   profileImage: z.string().url().optional(),
//   role: z.literal("AGENT"),
//   userStatus: z.enum(Object.values(userStatus) as [string, ...string[]]).optional(),
//   isActive: z.enum(Object.values(isActive) as [string, ...string[]]).optional(),
//   isDeleted: z.boolean().optional(),
//   isVerified: z.boolean().optional(),
//   approved: z.boolean().optional(),
//   createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional(),
// });

// export const agentUpdateSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().email().optional(),
//   password: z.string().min(6).optional(),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   nationalId: z.string().optional(),
//   profileImage: z.string().url().optional(),
//   // role update usually not allowed, but if yes:
//   role: z.literal("AGENT").optional(),
//   userStatus: z.enum(Object.values(userStatus) as [string, ...string[]]).optional(),
//     isActive: z.enum(Object.values(isActive) as [string, ...string[]]).optional(),

//   isDeleted: z.boolean().optional(),
//   isVerified: z.boolean().optional(),
//   approved: z.boolean().optional(),
//   // createdBy normally shouldn't be updated, so omit or keep optional
// });

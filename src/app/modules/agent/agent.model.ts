// // models/agent.model.ts
// import { Schema, model } from "mongoose";
// import { isActive, userStatus } from "../user/user.interface";
// import { IAgent } from "./agent.interface";
// const agentSchema = new Schema(
//   {
//     name: { type: String },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String },
//     address: { type: String },
//     nationalId: { type: String },
//     profileImage: { type: String },
//     role: {
//       type: String,
//       enum: ["AGENT"],
//       default: "AGENT",
//     },
//     userStatus: {
//       type: String,
//       enum: Object.values(userStatus),
//       default: userStatus.PENDING,
//     },
//     isActive: {
//       type: String,
//       enum: Object.values(isActive),
//       default: isActive.ACTIVE,
//     },
//     isDeleted: { type: Boolean, default: false },
//     isVerified: { type: Boolean, default: false },
//     approved: { type: Boolean, default: false },
//     createdBy: { type: Schema.Types.ObjectId, ref: "User", },
//   },
//   { timestamps: true }
// );

// export const Agent = model<IAgent>("Agent", agentSchema);

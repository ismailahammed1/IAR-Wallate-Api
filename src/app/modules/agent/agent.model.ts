// models/agent.model.ts
import { Schema, model } from "mongoose";
import { isActive, userStatus } from "../user/user.interface";
const agentSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    nid: String,
    photo: String,
    address: String,
    nationalId: String,
    profileImage: String,

    role: {
      type: String, 
      enum: ["AGENT"],
      default: "AGENT", 
    },

    // status: {
    status: {
      type: String,
       enum: Object.values(userStatus),
      default: "PENDING",
    },
    isActive: {
      type: String,
      enum: Object.values(isActive),
      default: isActive.ACTIVE,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
    },
  },
  { timestamps: true }
);

export const Agent = model("Agent", agentSchema);

// services/agent.service.ts

import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { Agent } from "./agent.model";
import { isActive, Role, userStatus } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";

 const approveAgentRequest = async (userId: string, verifiedToken: JwtPayload) => {
  // 1. Only ADMIN or SUPER_ADMIN can approve
  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(verifiedToken.role)) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to approve agent requests");
  }

  // 2. Find the user requesting agent role
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

if (user.role !== Role.USER || user.userStatus !== userStatus.PENDING) {
  throw new AppError(StatusCodes.BAD_REQUEST, "User is not eligible for agent approval");
}

  user.role = Role.AGENT;

  user.userStatus = userStatus.APPROVED;
  await user.save();


  // 3. Create agent
  const newAgent = await Agent.create({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    nationalId: user.nationalId,
    profileImage: user.profileImage,
    role: "AGENT",
    isActive: "ACTIVE",
    status: userStatus.APPROVED,
    createdBy: verifiedToken._id,
  });

  await user.deleteOne();

  return newAgent;
};

 const suspendAgentRequest = async (id: string) => {
  const agent = await Agent.findById(id);
  if (!agent) {
    throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
  }
  agent.status = userStatus.SUSPENDED;
    agent.isActive = isActive.INACTIVE; // Assuming you want to set isActive to INACTIVE when suspended
  await agent.save();
  return agent;
};
const reactivateAgentRequest = async (id: string) => {
  const agent = await Agent.findById(id);
  if (!agent) {
    throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
  }

  if (agent.status !== userStatus.SUSPENDED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent is not suspended");
  }

  agent.status = userStatus.APPROVED;
  agent.isActive = isActive.ACTIVE;// Reactivate the agent
  await agent.save();

  return agent;
};


export const AgentService = {
  approveAgentRequest,
    suspendAgentRequest,
    reactivateAgentRequest,
};
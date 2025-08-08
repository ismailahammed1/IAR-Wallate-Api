// services/agent.service.ts

import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { Agent } from "./agent.model";
import { isActive, Role, userStatus } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";

 const approveAgentRequest = async (userId: string, verifiedToken: JwtPayload) => {
  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(verifiedToken.role)) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to approve agent requests");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

if (user.role !== Role.USER || user.userStatus !== userStatus.PENDING) {
  throw new AppError(StatusCodes.BAD_REQUEST, "User is not eligible for agent approval");
}


  user.userStatus = userStatus.APPROVED;
  user.approved = true;
  user.isVerified = true;
  await user.save();
 return user
  
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
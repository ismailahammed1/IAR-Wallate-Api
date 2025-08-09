/* eslint-disable no-useless-catch */
// services/agent.service.ts

import { AppError } from "../../errorHelpers/AppError";
import { Agent } from "./agent.model";
import { AuthProviderType, IAuthProvider, Role, } from "../user/user.interface";

import { User } from "../user/user.model";
import { IAgent } from "./agent.interface";
import { envVars } from "../../config/envVars";
import bcryptjs from 'bcryptjs';


const agentCreate= async(payload: Partial<IAgent>)=>{
  try {
    const { name, email, password, role = Role.AGENT, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const isUserExist = await User.findOne({ email }) || await Agent.findOne({email});
  if (isUserExist) {
    throw new AppError(409, "User with this email already exists ");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const authProvider: IAuthProvider = {
    provider: AuthProviderType.CREDENTIAL,
    providerID: email,
  };

  const user = await Agent.create({
    name,
    email,
    password: hashedPassword,
    role, 
    auths: [authProvider],
    ...rest,
  });

  return user;
  } catch (error) {
    throw (error)
  }
};









// const reactivateAgentRequest = async (id: string) => {
//   const agent = await Agent.findById(id);
//   if (!agent) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
//   }

//   if (agent.status !== userStatus.SUSPENDED) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Agent is not suspended");
//   }

//   agent.status = userStatus.APPROVED;
//   agent.isActive = isActive.ACTIVE;// Reactivate the agent
//   await agent.save();

//   return agent;
// };


export const AgentService = {

    agentCreate,
    // reactivateAgentRequest,
};
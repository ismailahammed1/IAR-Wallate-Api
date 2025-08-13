/* eslint-disable no-useless-catch */

import { AppError } from "../../errorHelpers/AppError";
import { Agent } from "./agent.model";
import { AuthProviderType, IAuthProvider, Role, } from "../user/user.interface";
import { IAgent } from "./agent.interface";
import { envVars } from "../../config/envVars";
import bcryptjs from 'bcryptjs';


const agentCreate= async(payload: Partial<IAgent>)=>{
  try {
    const { name, email, password, role = Role.AGENT, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const isUserExist = await Agent.findOne({email});
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



const getAllAgent = async (page = 1, limit = 1) => {
try {
    const skip = (page - 1) * limit;

  const [Agents, total] = await Promise.all([
    Agent.find({}).skip(skip).limit(limit),
    Agent.countDocuments({}),
  ]);

  return {
    data: Agents,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
} catch (error) {
  throw error
}
};

const getSingleAgent = async (id: string) => {
  try {
      const Agents = await Agent.findById(id).select("-password");
    return {
        data: Agents
    }
  } catch (error) {
  throw error
    
  }
};
const getAgentHimSelf = async (userId: string) => {
   try {
     const Agents = await Agent.findById(userId).select("-password");
    return {
        data: Agents
    }
   } catch (error) {
    throw error
   }
};


// const reactivateAgentRequest = async (id: string) => {
//   const agent = await Agent.findById(id);
//   if (!agent) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
//   }

//   if (agent.status !== AgentStatus.SUSPENDED) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Agent is not suspended");
//   }

//   agent.status = AgentStatus.APPROVED;
//   agent.isActive = isActive.ACTIVE;// Reactivate the agent
//   await agent.save();

//   return agent;
// };


export const AgentService = {

    agentCreate,
      getAllAgent,
getAgentHimSelf,
getSingleAgent
    // reactivateAgentRequest,
};
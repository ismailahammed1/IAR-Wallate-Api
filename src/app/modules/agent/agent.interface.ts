import { isActive, userStatus } from "../user/user.interface";



export interface IAgent {
  name: string;
  email: string;
  phone: string;
  address?: string;
  nationalId?: string;
  profileImage?: string;
  role: string; // e.g., "AGENT"
  status: userStatus;
  isActive: isActive;
  isDeleted?: boolean;
  createdBy: string; // User ID of the creator
  createdAt?: Date;
  updatedAt?: Date;
}



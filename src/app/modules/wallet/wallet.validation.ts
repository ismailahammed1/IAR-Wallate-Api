import z from "zod";
import { AccountStatus } from "./wallet.interface";

export const walletSchema = z.object({
  user: z.string(), 
  balance: z.number().min(0),
  status: z.enum(AccountStatus).optional(),
});
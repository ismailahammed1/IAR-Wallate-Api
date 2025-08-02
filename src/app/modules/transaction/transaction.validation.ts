import { z } from "zod";
import { TransactionStatus, TransactionType } from "./transaction.interface";


export const transactionSchema = z.object({
  type: z.enum(TransactionType),
  from: z.string().nullable().optional(), 
  to: z.string().nullable().optional(),
  amount: z.number().positive(),
  fee: z.number().nonnegative().optional(),
  commission: z.number().nonnegative().optional(),
  initiatedBy: z.string(), 
  status: z.enum(TransactionStatus).optional(),
});

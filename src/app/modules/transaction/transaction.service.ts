import { Types } from "mongoose";
import { TransactionModel } from "./transaction.model";


const getAgentTransactions = async (userId: Types.ObjectId | string) => {
  const Transactions= await TransactionModel.find({
    $or: [{ from: userId }, { to: userId }, { initiatedBy: userId }],
  })
    .sort({ createdAt: -1 }) 
    .populate("from", "name email role") 
    .populate("to", "name email role");  

 
    return Transactions;
};

;

export const transactionService = {  getAgentTransactions,
};
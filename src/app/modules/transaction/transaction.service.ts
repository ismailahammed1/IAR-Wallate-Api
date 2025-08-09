/* eslint-disable no-useless-catch */
import { WalletModel } from "../wallet/wallet.model";
import { TransactionModel } from "./transaction.model";
import { AppError } from "../../errorHelpers/AppError";
import { AccountStatus } from "../wallet/wallet.interface";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Agent } from "../agent/agent.model";


const addMoneyByUser = async (userId: string, amount: number) => {
  try {
      if (!userId || !amount || amount <= 0) {
    throw new AppError(400, "User ID and valid amount are required");
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  if (user.userStatus !== "APPROVED") {
    throw new AppError(403, "Only approved users can add money");
  }

  const wallet = await WalletModel.findOne({ user: userId });
  if (!wallet) throw new AppError(404, "Wallet not found");

  wallet.balance += amount;
  await wallet.save();

  const transaction =await TransactionModel.create({
  transactionType: TransactionType.ADD,
  amount,
  fromUser: userId,
  toUser: userId,
  initiatedByUser: userId,
  status: TransactionStatus.COMPLETED,
});


  return {
    message: "Money added successfully",
    newBalance: wallet.balance,
    transaction,
  };
  } catch (error) {
throw error
  }
};

const userTopUp = async (userId: string, amount: number) => {
  try {
    if (!userId || !amount || amount <= 0) {
    throw new AppError(400, "User ID and valid amount are required");
  }

  const userWallet = await WalletModel.findOne({ user: userId });

  if (!userWallet) {
    throw new AppError(404, "User wallet not found");
  }

  if (userWallet.status === AccountStatus.BLOCKED) {
    throw new AppError(403, "User wallet is blocked");
  }

  // Add money
  userWallet.balance += amount;
  await userWallet.save();

  // Save transaction
  await TransactionModel.create({
    type: TransactionType.ADD,
    fromUser: userId,
    toUser: userId,
    amount,
    initiatedByUser: userId,
    status: TransactionStatus.COMPLETED,
  });

  return {
    balance: userWallet.balance,
    amountAdded: amount,
  };
  } catch (error) {
    throw error
  }
};
const userWithdrawToAgent = async (
  userId: string,
  agentId: string,
  amount: number
) => {
  try {
    if (!userId || !agentId || !amount || amount <= 0) {
      throw new AppError(400, "User ID, Agent ID, and valid amount are required");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "USER") {
      throw new AppError(403, "Invalid user or not authorized");
    }

    const agent = await Agent.findById(agentId);
    if (!agent || agent.role !== "AGENT") {
      throw new AppError(403, "Agent not found or invalid role");
    }

    const userWallet = await WalletModel.findOne({ user: userId });
    if (!userWallet) throw new AppError(404, "User wallet not found");

    const agentWallet = await WalletModel.findOne({ user: agentId });
    if (!agentWallet) throw new AppError(404, "Agent wallet not found");

    if (userWallet.status === AccountStatus.BLOCKED) {
      throw new AppError(403, "User wallet is blocked");
    }

    if (agentWallet.status === AccountStatus.BLOCKED) {
      throw new AppError(403, "Agent wallet is blocked");
    }

    if (userWallet.balance < amount) {
      throw new AppError(400, "Insufficient user wallet balance");
    }

    userWallet.balance -= amount;
    agentWallet.balance += amount;

    await userWallet.save();
    await agentWallet.save();

    const transaction = await TransactionModel.create({
      transactionType: TransactionType.WITHDRAW,
      amount,
      fromUser: userId,
      toUser: agentId,
      initiatedByUser: userId,
      status: TransactionStatus.COMPLETED,
    });

    return {
      message: "User withdrew to agent successfully",
      userBalance: userWallet.balance,
      agentBalance: agentWallet.balance,
      transaction,
    };
  } catch (error) {
    throw error;
  }
};




const sendMoneyByUser = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  try {
    if (!senderId || !receiverId || !amount || amount <= 0) {
      throw new AppError(400, "Sender, receiver, and valid amount are required");
    }
    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(receiverId);
    
    if (!senderUser || !receiverUser) {
      throw new AppError(404, "Sender or receiver user not found");
    }
    
    if (senderUser.role !== Role.USER || receiverUser.role !== Role.USER) {
      throw new AppError(403, "Only USER to USER transfers are allowed");
    }
    // finding wallets here
    const senderWallet = await WalletModel.findOne({ user: senderId });
    const receiverWallet = await WalletModel.findOne({ user: receiverId });
    
    if (!senderWallet || !receiverWallet) {
      throw new AppError(404, "Sender or receiver wallet not found");
    }
    
    if (senderWallet.status === AccountStatus.BLOCKED) {
      throw new AppError(403, "Sender wallet is blocked");
    }
    
    if (senderWallet.balance < amount) {
      throw new AppError(400, "Insufficient balance");
    }
    
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    
    await senderWallet.save();
    await receiverWallet.save();
    
    const transaction = await TransactionModel.create({
      transactionType: TransactionType.SEND,
      amount,
      fromUser: senderId,
      toUser: receiverId,
      initiatedByUser: senderId,
      status: TransactionStatus.COMPLETED,
    });
    
    return {
      message: "Money sent successfully",
      transaction,
      newSenderBalance: senderWallet.balance,
    };
  } catch (error) {
    throw error;
  }
};



// agent transactionSevice


const agentCashInToUser = async (agentId: string, userId: string, amount: number) => {
  try {
    if (!agentId || !userId || !amount || amount <= 0) {
      throw new AppError(400, "Agent ID, User ID, and valid amount are required");
    }

    const agent = await User.findById(agentId);
    const user = await User.findById(userId);

    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(403, "Only agents can perform cash-in");
    }

    if (!user || user.role !== Role.USER) {
      throw new AppError(404, "User not found or invalid");
    }

    const userWallet = await WalletModel.findOne({ user: userId });
    if (!userWallet) throw new AppError(404, "User wallet not found");

    userWallet.balance += amount;
    await userWallet.save();

    const transaction = await TransactionModel.create({
      transactionType: TransactionType.CASH_IN,
      amount,
      fromUser: agentId,
      toUser: userId,
      initiatedByUser: agentId,
      status: TransactionStatus.COMPLETED,
    });

    return {
      message: "Cash-in successful",
      newUserBalance: userWallet.balance,
      transaction,
    };
  } catch (error) {
    throw (error);
  }
};

const agentCashOutFromUser = async (agentId: string, userId: string, amount: number) => {
  try {
    if (!agentId || !userId || !amount || amount <= 0) {
      throw new AppError(400, "Agent ID, User ID, and valid amount are required");
    }

    const agent = await User.findById(agentId);
    const user = await User.findById(userId);

    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(403, "Only agents can perform cash-out");
    }

    if (!user || user.role !== Role.USER) {
      throw new AppError(404, "User not found or invalid");
    }

    const userWallet = await WalletModel.findOne({ user: userId });
    if (!userWallet) throw new AppError(404, "User wallet not found");

    if (userWallet.balance < amount) {
      throw new AppError(400, "Insufficient user balance");
    }

    userWallet.balance -= amount;
    await userWallet.save();

    const transaction = await TransactionModel.create({
      transactionType: TransactionType.CASH_OUT,
      amount,
      fromUser: userId,
      toUser: agentId,
      initiatedByUser: agentId,
      status: TransactionStatus.COMPLETED,
    });

    return {
      message: "Cash-out successful",
      newUserBalance: userWallet.balance,
      transaction,
    };
  } catch (error) {
    throw new AppError(500, (error as Error).message);
  }
};




export const transactionSevice={
  addMoneyByUser,
  userTopUp,
  sendMoneyByUser,
  userWithdrawToAgent,
  agentCashInToUser,
  agentCashOutFromUser,
}
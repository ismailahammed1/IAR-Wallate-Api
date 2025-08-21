
import { WalletModel } from "../wallet/wallet.model";
import { TransactionModel } from "./transaction.model";
import { AppError } from "../../errorHelpers/AppError";
import { AccountStatus } from "../wallet/wallet.interface";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Agent } from "../agent/agent.model";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

//Add Money by Approved User
const addMoneyByUser = async (userId: string, amount: number) => {
  if (!userId || !amount || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User ID and valid amount are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    if (user.userStatus !== "APPROVED") {
      throw new AppError(StatusCodes.FORBIDDEN, "Only approved users can add money");
    }

    const wallet = await WalletModel.findOne({ user: userId }).session(session);
    if (!wallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");

    wallet.balance += amount;
    await wallet.save({ session });

    const [transaction] = await TransactionModel.create([{
      transactionType: TransactionType.ADD,
      amount,
      fromUser: userId,
      toUser: userId,
      initiatedByUser: userId,
      status: TransactionStatus.COMPLETED,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(transaction._id)
      .populate("initiatedByUser", "name email role");

    return {
      message: "Money added successfully",
      newBalance: wallet.balance,
      transaction: populatedTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


//Withdraw by User to Agent
const userWithdrawToAgent = async (userId: string, agentId: string, amount: number) => {
  if (!userId || !agentId || !amount || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User ID, Agent ID, and valid amount are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    const agent = await Agent.findById(agentId).session(session);

    if (!user || user.role !== Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid user or not authorized");
    }
    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "Agent not found or invalid role");
    }

    const userWallet = await WalletModel.findOne({ user: userId }).session(session);
    const agentWallet = await WalletModel.findOne({ user: agentId }).session(session);

    if (!userWallet || !agentWallet) throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
    if (userWallet.status === AccountStatus.BLOCKED) throw new AppError(StatusCodes.FORBIDDEN, "User wallet is blocked");
    if (agentWallet.status === AccountStatus.BLOCKED) throw new AppError(StatusCodes.FORBIDDEN, "Agent wallet is blocked");

    if (userWallet.balance < amount) throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");

    userWallet.balance -= amount;
    agentWallet.balance += amount;

    await userWallet.save({ session });
    await agentWallet.save({ session });

    const [transaction] = await TransactionModel.create([{
      transactionType: TransactionType.WITHDRAW,
      amount,
      fromUser: userId,
      toUser: agentId,
      initiatedByUser: userId,
      status: TransactionStatus.COMPLETED,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(transaction._id)
      .populate("fromUser", "name email role")
      .populate("toUser", "name email role")
      .populate("initiatedByUser", "name email role");

    return {
      message: "User withdrew to agent successfully",
      userBalance: userWallet.balance,
      agentBalance: agentWallet.balance,
      transaction: populatedTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


//User to User Transfer

const sendMoneyByUser = async (senderId: string, receiverId: string, amount: number) => {
  if (!senderId || !receiverId || !amount || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Sender, receiver, and valid amount are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderUser = await User.findById(senderId).session(session);
    const receiverUser = await User.findById(receiverId).session(session);

    if (!senderUser || !receiverUser) {
      throw new AppError(StatusCodes.NOT_FOUND, "Sender or receiver user not found");
    }

    if (senderUser.role !== Role.USER || receiverUser.role !== Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Only USER to USER transfers are allowed");
    }

    const senderWallet = await WalletModel.findOne({ user: senderId }).session(session);
    const receiverWallet = await WalletModel.findOne({ user: receiverId }).session(session);

    if (!senderWallet || !receiverWallet) {
      throw new AppError(StatusCodes.NOT_FOUND, "Sender or receiver wallet not found");
    }

    if (senderWallet.status === AccountStatus.BLOCKED) {
      throw new AppError(StatusCodes.FORBIDDEN, "Sender wallet is blocked");
    }

    if (senderWallet.balance < amount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
    }

    // Update balances
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = await TransactionModel.create([{
      transactionType: TransactionType.SEND,
      amount,
      fromUser: senderId,
      toUser: receiverId,
      initiatedByUser: senderId,
      status: TransactionStatus.COMPLETED,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Re-fetch transaction with populated fields
    const populatedTransaction = await TransactionModel.findById(transaction[0]._id)
      .populate("fromUser", "name email role")
      .populate("toUser", "name email role")
      .populate("initiatedByUser", "name email role");

    return {
      message: "Money sent successfully",
      transaction: populatedTransaction,
      newSenderBalance: senderWallet.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


//Agent Cash In to User
const agentCashInToUser = async (agentId: string, userId: string, amount: number) => {
  if (!agentId || !userId || !amount || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent ID, User ID, and valid amount are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await Agent.findById(agentId).session(session);
    const user = await User.findById(userId).session(session);

    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "Only agents can perform cash-in");
    }

    if (!user || user.role !== Role.USER) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found or invalid");
    }

    const userWallet = await WalletModel.findOne({ user: userId }).session(session);
    if (!userWallet) throw new AppError(StatusCodes.NOT_FOUND, "User wallet not found");

    userWallet.balance += amount;
    await userWallet.save({ session });

    const [transaction] = await TransactionModel.create([{
      transactionType: TransactionType.CASH_IN,
      amount,
      fromAgent: agentId,
      toUser: userId,
      initiatedByAgent: agentId,
      status: TransactionStatus.COMPLETED,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(transaction._id)
      .populate("fromAgent", "name email role")
      .populate("toUser", "name email role")
      .populate("initiatedByAgent", "name email role");

    return {
      message: "Cash-in successful",
      newUserBalance: userWallet.balance,
      transaction: populatedTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


//Agent Cash Out from User
const agentCashOutFromUser = async (agentId: string, userId: string, amount: number) => {
  if (!agentId || !userId || !amount || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent ID, User ID, and valid amount are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await Agent.findById(agentId).session(session);
    const user = await User.findById(userId).session(session);

    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "Only agents can perform cash-out");
    }

    if (!user || user.role !== Role.USER) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found or invalid");
    }

    const userWallet = await WalletModel.findOne({ user: userId }).session(session);
    if (!userWallet) throw new AppError(StatusCodes.NOT_FOUND, "User wallet not found");

    if (userWallet.balance < amount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient user balance");
    }

    userWallet.balance -= amount;
    await userWallet.save({ session });

    const [transaction] = await TransactionModel.create([{
      transactionType: TransactionType.CASH_OUT,
      amount,
      fromUser: userId,
      toUser: agentId,
      initiatedByAgent: agentId,
      status: TransactionStatus.COMPLETED,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(transaction._id)
      .populate("fromAgent", "name email role")
      .populate("toUser", "name email role")
      .populate("initiatedByAgent", "name email role");

    return {
      message: "Cash-out successful",
      newUserBalance: userWallet.balance,
      transaction: populatedTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


//Get All User Transactions
const getUserTransactions = async () => {
  const users = await User.find({ role: Role.USER }, "_id");
  const userIds = users.map(user => user._id);

  const transactions = await TransactionModel.find({
    $or: [{ initiatedByUser: { $in: userIds } }],
  });

  return transactions;
};

//Get All Agent Transactions
const getAgentTransactions = async () => {
  const agents = await Agent.find({ role: Role.AGENT }, "_id");
  const agentIds = agents.map(agent => agent._id);

  const transactions = await TransactionModel.find({
    $or: [{ initiatedByAgent: { $in: agentIds } }],
  });

  return transactions;
};

export const transactionSevice = {
  addMoneyByUser,
  sendMoneyByUser,
  userWithdrawToAgent,
  agentCashInToUser,
  agentCashOutFromUser,
  getAgentTransactions,
  getUserTransactions,
};
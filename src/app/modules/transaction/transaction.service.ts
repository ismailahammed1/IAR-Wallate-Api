/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

import { WalletModel } from "../wallet/wallet.model";
import { TransactionModel } from "./transaction.model";
import { User } from "../user/user.model";

import { AccountStatus } from "../wallet/wallet.interface";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import { AppError } from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";

//  Add Money by Approved User
const addMoneyByUser = async (
  userId: string,
  amount: number,
  agentId: string
) => {
  amount = Number(amount);

  if (!userId || !agentId || !amount || amount <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User ID and valid amount are required"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await User.findById(agentId).session(session);
    const user = await User.findById(userId).session(session);

    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    if (user.userStatus !== "APPROVED") {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Only approved users can add money"
      );
    }

    if (user.role !== Role.USER) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Invalid user or not authorized"
      );
    }

    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Agent not found or invalid role"
      );
    }

    const wallet = await WalletModel.findOne({ user: userId }).session(session);
    if (!wallet)
      throw new AppError(StatusCodes.NOT_FOUND, "User wallet not found");

    // ✅ Add money to user wallet
    wallet.balance += amount;
    await wallet.save({ session });

    const [transaction] = await TransactionModel.create(
      [
        {
          transactionType: TransactionType.ADD,
          amount,
          fromUser: agentId, // agent initiates
          toUser: userId, // user receives
          initiatedByUser: userId,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(
      transaction._id
    ).populate("initiatedByUser", "name email role");

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


//  Withdraw from User to Agent
const userWithdrawToAgent = async (
  userId: string,
  agentId: string,
  amount: number
) => {
  amount = Number(amount);
  if (!userId || !agentId || !amount || amount <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User ID, Agent ID, and valid amount are required"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    const agent = await User.findById(agentId).session(session);

    if (!user || user.role !== Role.USER) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Invalid user or not authorized"
      );
    }

    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Agent not found or invalid role"
      );
    }

    const userWallet = await WalletModel.findOne({ user: userId }).session(
      session
    );
    const agentWallet = await WalletModel.findOne({ user: agentId }).session(
      session
    );

    if (!userWallet || !agentWallet)
      throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
    if (userWallet.status === AccountStatus.BLOCKED)
      throw new AppError(StatusCodes.FORBIDDEN, "User wallet is blocked");
    if (agentWallet.status === AccountStatus.BLOCKED)
      throw new AppError(StatusCodes.FORBIDDEN, "Agent wallet is blocked");
    if (userWallet.balance < amount)
      throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");

    userWallet.balance -= amount;
    agentWallet.balance += amount;

    await userWallet.save({ session });
    await agentWallet.save({ session });

    const [transaction] = await TransactionModel.create(
      [
        {
          transactionType: TransactionType.WITHDRAW,
          amount,
          fromUser: userId,
          toUser: agentId,
          initiatedByUser: userId,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(
      transaction._id
    )
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

//  User to User Transfer
const sendMoneyByUser = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  amount = Number(amount);
  if (!senderId || !receiverId || !amount || amount <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Sender, receiver, and valid amount are required"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    const receiver = await User.findById(receiverId).session(session);

    if (!sender || sender.role !== Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid sender");
    }

    if (!receiver || receiver.role !== Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid receiver");
    }

    const senderWallet = await WalletModel.findOne({ user: senderId }).session(
      session
    );
    const receiverWallet = await WalletModel.findOne({
      user: receiverId,
    }).session(session);

    if (!senderWallet || !receiverWallet)
      throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
    if (senderWallet.status === AccountStatus.BLOCKED)
      throw new AppError(StatusCodes.FORBIDDEN, "Sender wallet is blocked");
    if (senderWallet.balance < amount)
      throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const [transaction] = await TransactionModel.create(
      [
        {
          transactionType: TransactionType.SEND,
          amount,
          fromUser: senderId,
          toUser: receiverId,
          initiatedByUser: senderId,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(
      transaction._id
    )
      .populate("fromUser", "name email role")
      .populate("toUser", "name email role")
      .populate("initiatedByUser", "name email role");

    return {
      message: "Money sent successfully",
      newSenderBalance: senderWallet.balance,
      transaction: populatedTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


 const agentCashInToUser = async (
  agentId: string,
  userId: string,
  amount: number
) => {
  amount = Number(amount);
  if (!agentId || !userId || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid input");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await User.findById(agentId).session(session);
    const user = await User.findById(userId).session(session);
    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid agent");
    }
    if (!user || user.role !== Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid user");
    }

    const agentWallet = await WalletModel.findOne({ user: agentId }).session(session);
    const userWallet = await WalletModel.findOne({ user: userId }).session(session);

    if (!agentWallet || !userWallet) {
      throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
    }
    if (agentWallet.balance < amount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Agent has insufficient balance");
    }

    agentWallet.balance -= amount;
    userWallet.balance += amount;

    await agentWallet.save({ session });
    await userWallet.save({ session });

    const transaction = await TransactionModel.create(
      [
        {
          transactionType: TransactionType.CASH_IN,
          amount,
          fromAgent: agentId,
          toUser: userId,
          initiatedByAgent: agentId,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(transaction[0]._id)
      .populate("fromAgent", "name email")
      .populate("toUser", "name email")
      .populate("initiatedByAgent", "name email");

    return {
      message: "Cash‑in successful",
      newUserBalance: userWallet.balance,
      newAgentBalance: agentWallet.balance,
      transaction: populatedTransaction,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

 const agentCashOutFromUser = async (
  agentId: string,
  userId: string,
  amount: number
) => {
  amount = Number(amount);
  if (!agentId || !userId || amount <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid input");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await User.findById(agentId).session(session);
    const user = await User.findById(userId).session(session);
    if (!agent || agent.role !== Role.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid agent");
    }
    if (!user || user.role !== Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid user");
    }

    const userWallet = await WalletModel.findOne({ user: userId }).session(session);
    const agentWallet = await WalletModel.findOne({ user: agentId }).session(session);

    if (!userWallet || !agentWallet) {
      throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
    }
    if (userWallet.balance < amount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User has insufficient balance");
    }

    userWallet.balance -= amount;
    agentWallet.balance += amount;

    await userWallet.save({ session });
    await agentWallet.save({ session });

    const transaction = await TransactionModel.create(
      [
        {
          transactionType: TransactionType.CASH_OUT,
          amount,
          fromUser: userId,
          toAgent: agentId,
          initiatedByAgent: agentId,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedTransaction = await TransactionModel.findById(transaction[0]._id)
      .populate("fromUser", "name email")
      .populate("toAgent", "name email")
      .populate("initiatedByAgent", "name email");

    return {
      message: "Cash‑out successful",
      newUserBalance: userWallet.balance,
      newAgentBalance: agentWallet.balance,
      transaction: populatedTransaction,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


//  GET USER TRANSACTIONS (Paginated + Filtered)
const getUserTransactions = async (query: any) => {
  const {
    type,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  // Fetch all users
  const users = await User.find({ role: Role.USER }, "_id");
  const userIds = users.map((u) => u._id);

  const filter: any = {
    $or: [
      { fromUser: { $in: userIds } },
      { toUser: { $in: userIds } },
      { initiatedByUser: { $in: userIds } },
    ],
  };

  // Optional filters
  if (type && type !== "ALL") {
    filter.transactionType = type;
  }

  if (startDate && endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: from, $lte: to };
  }

  // Pagination metadata
  const total = await TransactionModel.countDocuments(filter);

  const transactions = await TransactionModel.find(filter)
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .populate("fromAgent", "name email")
    .populate("toAgent", "name email")
    .populate("initiatedByUser", "name email role")
    .populate("initiatedByAgent", "name email role")
    .sort({ createdAt: -1 })
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit);

  return {
    data: transactions,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};



const getAgentTransactions = async (query: any) => {
  const {
    type,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  // Fetch all agents
  const agents = await User.find({ role: Role.AGENT }, "_id");
  const agentIds = agents.map((a) => a._id);

  // Create filter object
  const filter: any = {
    $or: [
      { fromAgent: { $in: agentIds } },
      { toAgent: { $in: agentIds } },
      { initiatedByAgent: { $in: agentIds } },
    ],
  };

  // Apply filter based on transaction type
  if (type && type !== "ALL") {
    filter.transactionType = type;
  }

  // Apply date range filter
  if (startDate && endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);  // Ensure the end date includes the full day
    filter.createdAt = { $gte: from, $lte: to };
  }

  // Total transactions count for pagination
  const total = await TransactionModel.countDocuments(filter);

  // Fetch paginated transactions with populated fields
  const transactions = await TransactionModel.find(filter)
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .populate("fromAgent", "name email")
    .populate("toAgent", "name email")
    .populate("initiatedByUser", "name email role")
    .populate("initiatedByAgent", "name email role")
    .sort({ createdAt: -1 })
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit);

  return {
    data: transactions,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};



const getAllTransactions = async (query: any) => {
  const {
    role,
    transactionType,
    search,
    from,
    to,
    page = 1,
    limit = 10,
    status,
    minAmount,
    maxAmount,
  } = query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  let userIds: (string | mongoose.Types.ObjectId)[] = [];

  if (role === "USER" || role === "AGENT") {
    const users = await User.find({}, "_id");
    userIds = users.map((u) => u._id);
  }

  const transactionFilter: any = {};

  if (role === "USER") {
    transactionFilter.initiatedByUser = { $in: userIds };
  } else if (role === "AGENT") {
    transactionFilter.initiatedByAgent = { $in: userIds };
  }

  if (transactionType && transactionType !== "all") {
    transactionFilter.transactionType = transactionType;
  }

  // ✅ Status filter
  if (status && status !== "all") {
    transactionFilter.status = status;
  }

  // ✅ Amount filters
  if (minAmount != null) {
    transactionFilter.amount = transactionFilter.amount || {};
    transactionFilter.amount.$gte = parseFloat(minAmount);
  }

  if (maxAmount != null) {
    transactionFilter.amount = transactionFilter.amount || {};
    transactionFilter.amount.$lte = parseFloat(maxAmount);
  }

  // ✅ Date range
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    transactionFilter.createdAt = {
      $gte: fromDate,
      $lte: toDate,
    };
  }

  // ✅ Search
  if (search) {
    const searchConditions = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(searchConditions, "_id");
    const searchIds = users.map((u) => u._id);

    if (role === "USER") {
      transactionFilter.initiatedByUser = { $in: userIds };
    } else if (role === "AGENT") {
      transactionFilter.initiatedByAgent = { $in: userIds };
    } else {
      transactionFilter.$or = [
        { initiatedByUser: { $in: searchIds } },
        { initiatedByAgent: { $in: searchIds } },
      ];
    }
  }

  const total = await TransactionModel.countDocuments(transactionFilter);

  const transactions = await TransactionModel.find(transactionFilter)
    .populate("initiatedByUser", "name email phone role")
    .populate("initiatedByAgent", "name email phone role")
    .populate("fromUser", "name email phone role")
    .populate("toUser", "name email phone role")
    .populate("fromAgent", "name email phone role")
    .populate("toAgent", "name email phone role")
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit)
    .sort({ createdAt: -1 });

  return {
    data: transactions,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};



const getUserOwnTransactions = async (query: any, userId: string) => {
  const { type, startDate, endDate, page = 1, limit = 10 } = query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const filter: any = {
    $or: [
      { fromUser: userId },
      { toUser: userId },
      { initiatedByUser: userId },
    ],
  };

  if (type && type !== "ALL") {
    filter.transactionType = type;
  }

  if (startDate && endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: from, $lte: to };
  }

  const total = await TransactionModel.countDocuments(filter);

  const transactions = await TransactionModel.find(filter)
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .populate("fromAgent", "name email")
    .populate("toAgent", "name email")
    .populate("initiatedByUser", "name email role")
    .populate("initiatedByAgent", "name email role")
    .sort({ createdAt: -1 })
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit);

  return {
    data: transactions,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};


const getAgentOwnTransactions = async (query: any, agentId: string) => {
  const { type, startDate, endDate, page = 1, limit = 10 } = query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const filter: any = {
    $or: [
      { fromAgent: agentId },
      { toAgent: agentId },
      { initiatedByAgent: agentId },
      // Include transactions where the agent helped a user (e.g., add money or cash in)
      { fromUser: agentId },
      { toUser: agentId },
    ],
  };

  if (type && type !== "ALL") {
    filter.transactionType = type;
  }

  if (startDate && endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: from, $lte: to };
  }

  const total = await TransactionModel.countDocuments(filter);

  const transactions = await TransactionModel.find(filter)
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .populate("fromAgent", "name email")
    .populate("toAgent", "name email")
    .populate("initiatedByUser", "name email role")
    .populate("initiatedByAgent", "name email role")
    .sort({ createdAt: -1 })
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit);

  return {
    data: transactions,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};


//  Export Service
export const transactionService = {
  addMoneyByUser,
  userWithdrawToAgent,
  sendMoneyByUser,
  agentCashInToUser,
  agentCashOutFromUser,
getUserOwnTransactions,
getAgentOwnTransactions,
  getUserTransactions,
  getAgentTransactions,
  getAllTransactions,
};

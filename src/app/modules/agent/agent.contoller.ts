/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AgentService } from "./agent.service";
import { Agent } from "./agent.model";
import { JwtPayload } from "jsonwebtoken";

const approveAgent = catchAsync(async (req: Request, res: Response , next:NextFunction) => {
  if (!req.user) {
    return next(new Error("User not authenticated"));
  }
  const agent = await AgentService.approveAgentRequest(req.params.id, req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Agent approved successfully",
    data: agent,
  });
});

const suspendAgent = catchAsync(async (req: Request, res: Response) => {
  const agent = await AgentService.suspendAgentRequest(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Agent suspended successfully",
    data: agent,
  });
});

export const agentContoller = {
  approveAgent,
  suspendAgent,
};
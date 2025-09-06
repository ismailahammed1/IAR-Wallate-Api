import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { walletRouter } from "../app/modules/wallet/wallet.router";
import { AgentRoutes } from "../app/modules/agent/agent.route";
import { TransactionRoutes } from "../app/modules/transaction/transaction.route";
import { otpRoutes } from "../app/modules/otp/otp.route";

export const router = Router()

const moduleRouter = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/auth",
    router: AuthRoutes,
  },
  {
    path: "/wallets",
    router: walletRouter,
  },
  {
    path: "/agent",
    router: AgentRoutes,
  },
  {
    path: "/transactions", 
    router: TransactionRoutes,
  },
  {
    path: "/otp", 
    router: otpRoutes,
  },
];
moduleRouter.forEach(route => {
    router.use(route.path, route.router)
});
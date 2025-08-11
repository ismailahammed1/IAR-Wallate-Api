// transaction.route.ts

import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { transactionContoller } from "./transaction.contoller";



const router = Router();
// user transaction route
router.post("/add-money", checkAuth(Role.USER), transactionContoller.userAddMoney)
router.post("/withdraw", checkAuth(Role.USER), transactionContoller.userWithdrawToAgent)
router.post("/send-money", checkAuth(Role.USER), transactionContoller.sendMoney)

// agent transaction route

router.post("/cash-in",checkAuth(Role.AGENT),transactionContoller.agentCashIn)
router.post("/cash-out",checkAuth(Role.AGENT),transactionContoller.agentCashOut)
router.get("/agent-transaction/",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),transactionContoller.getAgentTransactions)
router.get("/user-transaction/",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),transactionContoller.  getUserTransactions
)



export const TransactionRoutes = router;

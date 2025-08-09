// transaction.route.ts

import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { transactionContoller } from "./transaction.contoller";



const router = Router();
router.post("/add-money", checkAuth(Role.USER), transactionContoller.userAddMoney)
router.post("/withdraw", checkAuth(Role.USER), transactionContoller.userWithdrawToAgent)
router.post("/send-money", checkAuth(Role.USER), transactionContoller.sendMoney)


export const TransactionRoutes = router;

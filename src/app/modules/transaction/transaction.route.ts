// transaction.route.ts

import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { transactionContoller } from "./transaction.contoller";



const router = Router();
router.post("/add-money", checkAuth(Role.USER,Role.AGENT), transactionContoller.userAddMoney)
router.post("/top-up", checkAuth(Role.USER), transactionContoller.userTopUp)


export const TransactionRoutes = router;

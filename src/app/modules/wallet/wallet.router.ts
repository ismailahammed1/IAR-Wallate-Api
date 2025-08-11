import { checkAuth } from "../../middlewares/checkAuth";
import express from 'express'
import { Role } from "../user/user.interface";
import { walletContoller } from "./wallet.contoller";


const router = express.Router();

router.get("/me", checkAuth(...Object.values(Role)),  walletContoller.getMyWallet);
router.patch("/block/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.blockWallet);
router.patch("/unblock/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.unblockWallet);
 router.get('/transactions/me', checkAuth(Role.USER, Role.AGENT, Role.ADMIN), walletContoller.getMyTransactions);


export const walletRouter=router;

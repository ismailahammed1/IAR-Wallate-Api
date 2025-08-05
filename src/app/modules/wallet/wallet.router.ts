import { checkAuth } from "../../middlewares/checkAuth";
import express from 'express'
import { Role } from "../user/user.interface";
import { walletContoller } from "./wallet.contoller";


const router = express.Router();

router.get("/me", checkAuth(...Object.values(Role)),  walletContoller.getMyWallet);
router.patch("/block/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.blockWallet);
router.patch("/unblock/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.unblockWallet);
router.patch("/add-money/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.addMoneyWallet);
router.patch("/withdraw-money/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.withdrawMoneyWallet);
router.patch("/cash-in/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.cashInWallet);
router.patch("/cash-out/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.cashOutWallet);  
router.patch("/send-money/:fromId/:toId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.sendMoneyWallet);    
    

export const walletRouter=router;

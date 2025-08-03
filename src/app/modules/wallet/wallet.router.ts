import { checkAuth } from "../../middlewares/checkAuth";
import express from 'express'
import { Role } from "../user/user.interface";
import { walletContoller } from "./wallet.contoller";

const router = express.Router();

router.get("/me", checkAuth(...Object.values(Role)),  walletContoller.getMyWallet);
router.patch("/block/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletContoller.blockOrUnblockWallet);

export const walletRouter=router;


import express from 'express'

import { walletContoller } from "./wallet.contoller";

const router = express.Router();

router.get("/me",  walletContoller.getMyWallet);

export const walletRouter=router;

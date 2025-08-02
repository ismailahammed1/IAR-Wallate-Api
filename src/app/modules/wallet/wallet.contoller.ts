
import { Request, Response } from "express";
import { WalletModel } from "./wallet.model";
import { AccountStatus } from "./wallet.interface";




 const getMyWallet = async (req: Request, res: Response) => {
  try {
const user = req.user as { _id: string; role: string };
const userId = user._id;

    const wallet = await WalletModel.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found." });
    }

    res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

 
export const walletContoller={

    getMyWallet
}
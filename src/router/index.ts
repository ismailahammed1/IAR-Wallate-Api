import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { walletRouter } from "../app/modules/wallet/wallet.router";

export const router = Router()

const moduleRouter=[
    {
        path:"/user",
        router:UserRoutes
    },
    {
        path:"/auth",
        router:AuthRoutes,
    },
    {
        path:"/wallets",
        router:walletRouter,
    }
]
moduleRouter.forEach(route => {
    router.use(route.path, route.router)
});
import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";
import { AuthRoutes } from "../app/modules/auth/auth.route";

export const router = Router()

const moduleRouter=[
    {
        path:"/user",
        router:UserRoutes
    },
    {
        path:"/auth",
        router:AuthRoutes,
    }
]
moduleRouter.forEach(route => {
    router.use(route.path, route.router)
});
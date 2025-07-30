import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";

export const router = Router()

const moduleRouter=[
    {
        path:"/user",
        router:UserRoutes
    }
]
moduleRouter.forEach(route => {
    router.use(route.path, route.router)
});
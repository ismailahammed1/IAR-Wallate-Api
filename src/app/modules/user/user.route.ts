import { Router } from "express";
import userContoller from "./user.contoller";


const router = Router();


router.post("/register", userContoller.userRegister)


export const UserRoutes = router
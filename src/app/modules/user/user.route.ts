import { Router } from "express";
import userContoller from "./user.contoller";


const router = Router();


router.post("/register", userContoller.userRegister)
router.get("/all-users", userContoller.getAllUser)


export const UserRoutes = router
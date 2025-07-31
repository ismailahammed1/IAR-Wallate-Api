import { Router } from "express";
import { AuthController } from "./auth.contoller";




const router = Router();



router.post("/login", AuthController.credentialLoging);
router.post("/refresh-token", AuthController.credentialLoging);



export const AuthRoutes = router;

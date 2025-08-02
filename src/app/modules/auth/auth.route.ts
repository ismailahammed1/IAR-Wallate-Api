import { NextFunction, Request, Response, Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { AuthController } from "./auth.contoller";
import { envVars } from "../../config/envVars";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword);

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
router.get("/google/callback", passport.authenticate("google", { 
    failureRedirect: `${envVars.FRONT_END_URL}/login?error=Please contact with out support team!` }),
 AuthController.googleCallbackController)


export const AuthRoutes = router;
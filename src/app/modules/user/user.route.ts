import { Router } from "express";
import userContoller from "./user.contoller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userContoller.userRegister
);
router.get("/all-users", checkAuth(Role.USER,Role.SUPER_ADMIN), userContoller.getAllUser);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userContoller.newUpdatedUser
);

export const UserRoutes = router;

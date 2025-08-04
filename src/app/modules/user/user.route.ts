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
router.get("/all-users", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userContoller.getAllUser);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userContoller.newUpdatedUser
);
router.get("/me", checkAuth(...Object.values(Role)), userContoller.getMe)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.getSingleUser)
export const UserRoutes = router;

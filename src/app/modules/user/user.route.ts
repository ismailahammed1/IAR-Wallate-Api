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
  "/update",
  checkAuth(Role.ADMIN,Role.AGENT, Role.USER),
  userContoller.newUpdatedUser
);
router.get("/me", checkAuth(...Object.values(Role)), userContoller.getMe)
router.get(
  "/search",
  checkAuth(  Role.AGENT, Role.USER),
 userContoller.searchUsers
);
router.get("/singleuser", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.getSingleUser)
router.get("/users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.getUsers);
router.get("/agents", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.getAgents);

router.patch("/block-unblock/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.blockUnblockUser);
router.patch("/approve-agent/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.approveAgent);
router.patch("/suspend-agent/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userContoller.suspendAgent);



export const UserRoutes = router;

// routes/agent.route.ts
import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { agentContoller } from "./agent.contoller";

const router = Router();

router.patch("/approve/:id", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), agentContoller.approveAgent);
router.patch("/suspend/:id", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), agentContoller.suspendAgent);
router.patch("/reactive/:id", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), agentContoller.suspendAgent);

export const AgentRoutes = router;

// routes/agent.route.ts
import { Router } from "express";


import { agentContoller } from "./agent.contoller";
import { validateRequest } from "../../middlewares/validateRequest";
import { agentCreateSchema } from "./agent.validation";

const router = Router();



router.post("/agent-register", validateRequest(agentCreateSchema), agentContoller.agentRegister);
export const AgentRoutes = router;

// routes/agent.route.ts
// import { Router } from "express";


// import { agentContoller } from "./agent.contoller";
// import { validateRequest } from "../../middlewares/validateRequest";
// import { agentCreateSchema } from "./agent.validation";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { Role } from "../user/user.interface";

// const router = Router();



// router.post("/agent-register", validateRequest(agentCreateSchema), agentContoller.agentRegister);
// router.get("/all-agents", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), agentContoller.getAllAgent);

// // router.get("/profileinfo", checkAuth(...Object.values(Role)), agentContoller.getAgentHimSelf);
// router.get("/profileinfo", (req, res, next) => {
//   console.log("Hit /agent/profileinfo route");
//   next();
// }, checkAuth(Role.AGENT), agentContoller.getAgentHimSelf);

// router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), agentContoller.getSingleAgent)

// export const AgentRoutes = router;

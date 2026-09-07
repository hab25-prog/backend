import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import { getDashboard } from "./dashboard.controller.js";

const dashboardRouter = Router();
dashboardRouter.get("/getAllDashboard", isLogin, asyncHandler(getDashboard));
export default dashboardRouter;

import { Router } from "express";
import routers from "../../routers/index.js";
import {
  getProjectActivities,
  getTaskActivities,
  getWorkspaceActivities,
} from "./activity.controller.js";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";

const activityRoute = Router();

/*
/workspaces/:workspaceId/
/projects/:projectId/
/tasks/:taskId/
*/
activityRoute.get(
  "/workspaces/:workspaceId",
  isLogin,
  asyncHandler(getWorkspaceActivities),
);
activityRoute.get(
  "/projects/:projectId",
  isLogin,
  asyncHandler(getProjectActivities),
);
activityRoute.get("/tasks/:taskId", isLogin, asyncHandler(getTaskActivities));
export default activityRoute;

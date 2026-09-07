import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import type { Response } from "express";
import { ActivityService } from "./activity.service.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";

const activityService = new ActivityService();

export const getWorkspaceActivities = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const workSpaceId = req.params.workspaceId;
  const id = req.user?.id;
  const data = await activityService.getWorkspaceActivities(workSpaceId, id);
  res.status(200).json({ status: true, data: data });
};

export const getProjectActivities = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.user?.id;
  const { projectId } = req.params;
  const data = await activityService.getProjectActivities(projectId, id);
  res.status(200).json({ status: true, data: data });
};

export const getTaskActivities = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const taskId = req.params.taskId;
  const id = req.user?.id;

  const data = await activityService.getTaskActivities(taskId, id);

  res.status(200).json({ status: true, data: data });
};

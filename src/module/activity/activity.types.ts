import type { Prisma } from "../../../generated/prisma/browser.js";
import type {
  ActivityAction,
  ActivityTargetType,
} from "../../../generated/prisma/enums.js";

export type CreateActivityInput = {
  action: ActivityAction;
  targetId: string;
  targetType: ActivityTargetType;
  actorId?: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  metadata?: Prisma.InputJsonValue;
};
export type GetWorkspaceActivitiesInput = {
  workSpaceId: string;
  targetType: "WORKSPACE";
};
export type GetProjectActivitiesInput = {
  projectId: string;
  targetType: "PROJECT";
};
export type GetTaskActivitesInpute = {
  taskId: string;
  targetType: "TASK";
};

import type { WorkspaceRole } from "../../../generated/prisma/enums.js";

export type CreateWorkspaceInput = {
  name: string;
  description?: string;
};
export type UpdateMemberRole = {
  id: string;
  role: WorkspaceRole;
};
export type WorkSpaceMembers = [
  {
    id: string;
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
    joinedAt: Date;
  },
];

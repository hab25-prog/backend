import type { ProjectMember } from "../../../generated/prisma/browser.js";
import type { ProjectRole } from "../../../generated/prisma/enums.js";

export type AllProjects = {
  id: string;
  tasks: {
    done: number;
    notDone: number;
  };
  name: string;
  description: string | null;
  updatedAt: Date;
  members: number;
};
export type UpdateRole = {
  id: string;
  role: ProjectRole;
};
export type GetProjectMember = ProjectMember[];

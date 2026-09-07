import { prisma } from "../../config/prisma.js";
import type {
  CreateActivityInput,
  GetProjectActivitiesInput,
  GetTaskActivitesInpute,
  GetWorkspaceActivitiesInput,
} from "./activity.types.js";

export class ActivityRepository {
  async create(data: CreateActivityInput) {
    return await prisma.activity.create({
      data: data,
    });
  }
  async findById(id: string) {
    return await prisma.activity.findUnique({
      where: {
        id: id,
      },
    });
  }
  async findWorkspaceActivities(data: GetWorkspaceActivitiesInput) {
    return await prisma.activity.findMany({
      where: {
        workspaceId: data.workSpaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findProjectActivities(data: GetProjectActivitiesInput) {
    return await prisma.activity.findMany({
      where: {
        projectId: data.projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findTaskActivites(data: GetTaskActivitesInpute) {
    return await prisma.activity.findMany({
      where: {
        taskId: data.taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async delete(id: string) {
    return await prisma.activity.delete({
      where: { id: id },
    });
  }
}

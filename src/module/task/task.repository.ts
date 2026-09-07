import { prisma } from "../../config/prisma.js";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export class TaskRepository {
  async createTask(data: {
    title: string;
    description?: string;
    projectId: string;
    creatorId: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }) {
    return await prisma.task.create({
      data,
    });
  }

  async findById(id: string) {
    return await prisma.task.findUnique({
      where: { id },
    });
  }

  async findManyByProject(projectId: string) {
    return await prisma.task.findMany({
      where: { projectId },
    });
  }

  async findManyByCreator(creatorId: string) {
    return await prisma.task.findMany({
      where: { creatorId },
    });
  }

  async findManyByAssignee(assigneeId: string) {
    return await prisma.task.findMany({
      where: { assigneeId },
    });
  }

  async updateTask(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      projectId?: string;
      assigneeId?: string | null;
    },
  ) {
    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: TaskStatus) {
    return await prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async updatePriority(id: string, priority: TaskPriority) {
    return await prisma.task.update({
      where: { id },
      data: { priority },
    });
  }

  async assignTask(id: string, assigneeId: string) {
    console.log("the id and userId", id, assigneeId);
    return await prisma.task.update({
      where: { id },
      data: {
        assigneeId: assigneeId,
      },
    });
  }

  async unassignTask(id: string) {
    return await prisma.task.update({
      where: { id },
      data: { assigneeId: null },
    });
  }

  async deleteTask(id: string) {
    return await prisma.task.delete({
      where: { id },
    });
  }
}

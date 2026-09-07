import { string } from "zod";
import type {
  ProjectRole,
  ProjectStatus,
} from "../../../generated/prisma/enums.js";
import { prisma } from "../../config/prisma.js";
import type { UpdateRole } from "./project.types.js";
export class ProjectRepository {
  async getMember(userId: string, projectId: string) {
    return await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
    });
  }
  async createProject(data: {
    name: string;
    description?: string;
    ownerId: string;
    workspaceId: string;
    dueDate?: Date;
  }) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: data.name,
          ownerId: data.ownerId,
          workspaceId: data.workspaceId,
        },
      });
      const member = await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: data.ownerId,
          role: "OWNER",
        },
      });
      return project;
    });
  }

  async findById(id: string) {
    return await prisma.project.findUnique({
      where: { id: id },
    });
  }
  async getProjectById(projectId: string) {
    return await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        workspaceId: true,
        ownerId: true,
      },
    });
  }

  async findManyByUser(id: string) {
    return await prisma.project.findMany({ where: { ownerId: id } });
  }

  async updateProject(
    id: string,
    data: {
      name?: string;
      description?: string;
      ownerId?: string;
      dueDate?: Date;
      status?: ProjectStatus;
    },
  ) {
    return await prisma.project.update({
      where: { id },
      data: data,
    });
  }

  async deleteProject(id: string) {
    return await prisma.$transaction(async (tx) => {
      const task = await tx.task.deleteMany({ where: { projectId: id } });
      const member = await tx.projectMember.deleteMany({
        where: {
          projectId: id,
        },
      });
      const project = await tx.project.delete({ where: { id: id } });
      return project;
    });
  }
  async getRole(userId: string, projectId: string) {
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
    return member?.role;
  }

  async addMember(userId: string, projectId: string, role: string) {
    return await prisma.projectMember.create({
      data: {
        userId,
        projectId,
        role: role as ProjectRole,
      },
    });
  }
  async ChangeRole(data: UpdateRole) {
    return await prisma.projectMember.update({
      where: {
        id: data.id,
      },
      data: {
        role: data.role,
      },
    });
  }
  async removeMember(id: string, projectId: string) {
    return await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          userId: id,
          projectId: projectId,
        },
      },
    });
  }
  async getAllMember(projectId: string) {
    return await prisma.projectMember.findMany({
      where: {
        projectId: projectId,
      },
    });
  }
}

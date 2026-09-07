import { text } from "node:stream/consumers";
import { WorkspaceRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../config/prisma.js";
import { id } from "zod/locales";
import type { UpdateMemberRole } from "./workspace.type.js";

export class WorkSpaceRepository {
  async createWorkSpace(data: {
    name: string;
    description?: string;
    ownerId: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const workSpace = await tx.workspace.create({ data });
      const menber = await tx.workspaceMember.create({
        data: {
          userId: workSpace.ownerId,
          role: "OWNER",
          workspaceId: workSpace.id,
        },
      });
      return workSpace;
    });
  }

  async getWorkSpaceById(id: string) {
    return await prisma.workspace.findUnique({ where: { id: id } });
  }
  async getAllWorkSpace(userId: string) {
    const ownWorkSpace = await prisma.workspace.findMany({
      where: { ownerId: userId },
    });
    const gustWorkSpace = await prisma.workspaceMember.findMany({
      where: {
        userId: userId,
        role: "OWNER"!,
      },
    });

    return { ownWorkSpace, gustWorkSpace };
  }
  // async getWorkSpaceByUserId(userId: string) {
  //   return await prisma.workspace.findMany({
  //     where: {
  //       ownerId: userId,
  //     },
  //   });
  // }
  async getWorkSpaceMember(userId: string, workSpaceId: string) {
    return await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          userId: userId,
          workspaceId: workSpaceId,
        },
      },
    });
  }
  async getAllMember(workSpaceId: string) {
    return await prisma.workspaceMember.findMany({
      where: {
        workspaceId: workSpaceId,
      },
    });
  }
  async updateMemberRole(data: UpdateMemberRole) {
    return await prisma.workspaceMember.update({
      where: {
        id: data.id,
      },
      data: {
        role: data.role,
      },
    });
  }
  async addProjectToWorkSpace(projectId: string, workSpaceId: string) {
    return await prisma.project.update({
      where: { id: projectId },
      data: { workspaceId: workSpaceId },
    });
  }
  async addWorkSpaceMember(
    workSpaceId: string,
    userId: string,
    role: WorkspaceRole,
  ) {
    return await prisma.workspaceMember.create({
      data: {
        workspaceId: workSpaceId,
        userId: userId,
        role: role,
      },
    });
  }
  async removeMember(id: string) {
    return await prisma.workspaceMember.delete({
      where: {
        id: id,
      },
    });
  }
}

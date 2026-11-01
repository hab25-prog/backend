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
    const data = await prisma.workspace.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        ownerId: true,
        description: true,
        projects: {
          select: {
            id: true,
            name: true,
            tasks: true,
            status: true,
            dueDate: true,
            description: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                fullName: true,
                username: true,
                id: true,
                email: true,
              },
            },
            role: true,
          },
        },
        files: true,
        meetings: true,
        workeSpaceA: true,
      },
    });
    const brandNew = {
      ...data,
      members: data?.members.map((m) => {
        return { ...m.user, role: m.role };
      }),
    };
    return brandNew;
  }
  async getAllWorkSpace(userId: string) {
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Workspaces they own
          { members: { some: { userId } } }, // Workspaces they are a member of
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        members: {
          select: {
            role: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        projects: true,
      },
    });
    const bradNew = workspaces.map((w) => {
      return {
        ...w,
        name: w.name,
        description: w.description,
        members: w.members.length,
        projects: w.projects.length,
        ownerName: w.members.find((m) => m.role == "OWNER")?.user.username,
        id: w.id,
      };
    });
    return bradNew;
  }
  async getWorkSpaceId(id: string) {
    const workSpace = await prisma.workspace.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,

        members: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                role: true,
              },
            },
          },
        },
      },
    });
    const brandNew = {
      workSpaceId: workSpace?.id,
      name: workSpace?.name,
      members: workSpace?.members.map((w) => {
        return {
          userId: w.user.id,
          userName: w.user.username,
          role: w.user.role,
        };
      }),
    };
  }
  // async getWorkSpaceByUserId(userId: string) {
  //   return await prisma.workspace.findMany({
  //     where: {
  //       ownerId: userId,
  //     },
  //   });
  // }
  async getWorkSpaceMember(userId: any, workSpaceId: any) {
    console.log(
      "in repository : ",
      `workSpaceId : ${workSpaceId}`,
      `userId : ${userId}`,
    );
    const data = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workSpaceId,
          userId: userId,
        },
      },
    });

    return data;
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

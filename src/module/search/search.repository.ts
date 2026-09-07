import type { title } from "process";
import { prisma } from "../../config/prisma.js";
import type { SearchQuery } from "./search.types.js";

export class SearchRepository {
  async searchUsers(data: SearchQuery, userId: string) {
    return await prisma.user.findMany({
      where: {
        isActive: true,

        workspaceMemberships: {
          some: {
            workspace: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        },

        OR: [
          {
            username: {
              contains: data.q,
              mode: "insensitive",
            },
          },
          {
            fullName: {
              contains: data.q,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: data.q,
              mode: "insensitive",
            },
          },
        ],
      },

      select: {
        id: true,
        username: true,
        fullName: true,
        profileImage: true,
      },

      take: 10,
    });
  }
  async searchWorkspaces(data: SearchQuery) {
    return await prisma.workspace.findMany({
      where: {
        OR: [
          {
            name: {
              contains: data.q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: data.q,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        members: true,
        ownerId: true,
      },
      take: data.limit || 10,
    });
  }
  async searchProjects(data: SearchQuery) {
    return await prisma.project.findMany({
      where: {
        name: {
          contains: data.q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        members: true,
      },
    });
  }
  async searchTasks(data: SearchQuery) {
    return await prisma.task.findMany({
      where: {
        OR: [
          {
            title: {
              contains: data.q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: data.q,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        projectId: true,
      },
    });
  }
  async searchFiles(data: SearchQuery) {
    return await prisma.file.findMany({
      where: {
        OR: [
          {
            originalName: {
              contains: data.q,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        originalName: true,
        fileType: true,
        fileSize: true,
        workspaceId: true,
      },
    });
  }
  async searchConversations(data: SearchQuery) {
    return await prisma.conversation.findMany({
      where: {
        name: {
          contains: data.q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        participants: true,
      },
    });
  }
  async searchMessages(data: SearchQuery) {
    return await prisma.message.findMany({
      where: {
        content: {
          contains: data.q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        conversationId: true,
        conversation: true,
        updatedAt: true,
      },
    });
  }
}

import { prisma } from "../../config/prisma.js";
import type { CreateFileInput } from "./file.types.js";

export class FileRepository {
  async create(data: CreateFileInput) {
    const createData: {
      originalName: string;
      storedName: string;
      mimeType: string;
      size: number;
      storageKey: string;
      uploadedById: string;
      taskId?: string | null;
      projectId?: string | null;
      workspaceId?: string | null;
      commentId?: string | null;
    } = {
      originalName: data.originalName,
      storedName: data.storedName,
      mimeType: data.mimeType,
      size: data.size,
      storageKey: data.storageKey,
      uploadedById: data.uploadedById,
    };

    if (data.taskId !== undefined) {
      createData.taskId = data.taskId;
    }
    if (data.projectId !== undefined) {
      createData.projectId = data.projectId;
    }
    if (data.workspaceId !== undefined) {
      createData.workspaceId = data.workspaceId;
    }
    if (data.commentId !== undefined) {
      createData.commentId = data.commentId;
    }

    return await prisma.file.create({
      data: createData,
    });
  }

  async findById(id: string) {
    return await prisma.file.findUnique({
      where: {
        id,
      },
    });
  }

  async findByTask(taskId: string) {
    return await prisma.file.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findByProject(projectId: string) {
    return await prisma.file.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findByWorkspace(workspaceId: string) {
    return await prisma.file.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findByComment(commentId: string) {
    return await prisma.file.findMany({
      where: {
        commentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async delete(id: string) {
    return await prisma.file.delete({
      where: {
        id,
      },
    });
  }
}

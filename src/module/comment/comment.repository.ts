import { prisma } from "../../config/prisma.js";
import type { CreateCommentInput } from "./comment.types.js";

export class CommentRepository {
  async create(data: CreateCommentInput) {
    return await prisma.comment.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        taskId: data.taskId,
      },
    });
  }
  async update(id: string, content: string) {
    return await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        content,
      },
    });
  }
  async findById(id: string) {
    return await prisma.comment.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByTask(taskId: string) {
    return await prisma.comment.findMany({
      where: {
        taskId: taskId,
      },
    });
  }
  async delete(id: string) {
    return await prisma.comment.delete({
      where: {
        id: id,
      },
    });
  }
  async countByTask() {}
}

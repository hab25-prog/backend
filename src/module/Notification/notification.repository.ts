import { prisma } from "../../config/prisma.js";
import type { CreateNotificationInput } from "./notification.types.js";

export class NotificationRepository {
  async create(data: CreateNotificationInput) {
    return prisma.notification.create({
      data,
      include: {
        recipient: {
          select: { id: true, fullName: true },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  async findAllByRecipient(recipientId: string) {
    return prisma.notification.findMany({
      where: { recipientId },
      select: {
        id: true,
        isRead: true,
        message: true,
        createdAt: true,
        title: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async countUnread(recipientId: string) {
    return prisma.notification.count({
      where: { recipientId, isRead: false },
    });
  }

  async markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  }

  async deleteAll(recipientId: string) {
    return prisma.notification.deleteMany({ where: { recipientId } });
  }
}

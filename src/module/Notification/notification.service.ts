import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { AppError } from "../../shared/errors/AppError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { NotificationRepository } from "./notification.repository.js";
import type { CreateNotificationInput } from "./notification.types.js";

const notificationRepository = new NotificationRepository();
type NotificationIdInput = string | string[] | undefined;

export class NotificationService {
  async createNotification(data: CreateNotificationInput) {
    return notificationRepository.create(data);
  }
  // THE CODE BELLOW THIS IS FUTURE UPDATABLE 
  async notifyTaskAssigned() {}
  async notifyWorkspaceInvited() {}
  async notifyProjectMemberAdded() {}
  async getNotifications(recipientId?: string) {
    const verifiedRecipientId = this.requireRecipientId(recipientId);
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.findAllByRecipient(verifiedRecipientId),
      notificationRepository.countUnread(verifiedRecipientId),
    ]);

    return { notifications, unreadCount };
  }

  async markAsRead(id: NotificationIdInput, recipientId?: string) {
    const notificationId = this.requireNotificationId(id);
    const verifiedRecipientId = this.requireRecipientId(recipientId);
    const notification = await this.getOwnedNotification(
      notificationId,
      verifiedRecipientId,
    );

    if (notification.isRead) {
      return notification;
    }

    return notificationRepository.markRead(notificationId);
  }

  async markAllAsRead(recipientId?: string) {
    return notificationRepository.markAllRead(
      this.requireRecipientId(recipientId),
    );
  }

  async deleteNotification(id: NotificationIdInput, recipientId?: string) {
    const notificationId = this.requireNotificationId(id);
    const verifiedRecipientId = this.requireRecipientId(recipientId);
    await this.getOwnedNotification(notificationId, verifiedRecipientId);
    return notificationRepository.delete(notificationId);
  }

  async deleteAllNotifications(recipientId?: string) {
    return notificationRepository.deleteAll(
      this.requireRecipientId(recipientId),
    );
  }

  private async getOwnedNotification(id: string, recipientId: string) {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new NoteFoundError("Notification was not found");
    }

    if (notification.recipientId !== recipientId) {
      throw new ForbiddenError("You cannot access this notification");
    }

    return notification;
  }

  private requireRecipientId(recipientId?: string) {
    if (!recipientId) {
      throw new UnauthorizedError("Authentication is required");
    }

    return recipientId;
  }

  private requireNotificationId(id: NotificationIdInput) {
    if (typeof id !== "string" || id.length === 0) {
      throw new AppError("Notification id is required", 400);
    }

    return id;
  }
}

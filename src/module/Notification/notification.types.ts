import type {
  NotificationType,
  Prisma,
} from "../../../generated/prisma/client.js";

/** Input used by application services when they create a notification. */
export type CreateNotificationInput = {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Prisma.InputJsonValue;
};
export type GetNotificationsInput = {};
export type MarkNotificationReadInput = {};
export type DeleteNotificationInput = {};
export type NotificationResponse = {};
export type CreateNotificationType = NotificationType;

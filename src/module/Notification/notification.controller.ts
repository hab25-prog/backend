import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { NotificationService } from "./notification.service.js";

const notificationService = new NotificationService();

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = await notificationService.getNotifications(req.user?.id);
  res.status(200).json({ status: true, data });
};

export const markNotificationAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user?.id,
  );
  res.status(200).json({ status: true, data: notification });
};

export const markAllNotificationsAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = await notificationService.markAllAsRead(req.user?.id);
  res.status(200).json({ status: true, data: result });
};

export const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  await notificationService.deleteNotification(
    req.params.id,
    req.user?.id,
  );
  res.status(200).json({ status: true, message: "Notification deleted" });
};

export const deleteAllNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = await notificationService.deleteAllNotifications(
    req.user?.id,
  );
  res.status(200).json({ status: true, data: result });
};

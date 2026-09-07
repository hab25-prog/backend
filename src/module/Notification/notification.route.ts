import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/", isLogin, asyncHandler(getNotifications));
notificationRouter.patch(
  "/read-all",
  isLogin,
  asyncHandler(markAllNotificationsAsRead),
);
notificationRouter.patch(
  "/:id/read",
  isLogin,
  asyncHandler(markNotificationAsRead),
);
notificationRouter.delete("/", isLogin, asyncHandler(deleteAllNotifications));
notificationRouter.delete("/:id", isLogin, asyncHandler(deleteNotification));

export default notificationRouter;

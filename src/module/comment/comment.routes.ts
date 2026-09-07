import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import {
  createComment,
  deleteComment,
  getTaskComments,
  updateComment,
} from "./comment.controller.js";

const commentRouter = Router();
commentRouter.post(
  "/createComment/:taskId",
  isLogin,
  asyncHandler(createComment),
);
commentRouter.get("/comments", isLogin, asyncHandler(getTaskComments));
commentRouter.patch(
  "/comments/:commentId",
  isLogin,
  asyncHandler(updateComment),
);
commentRouter.delete(
  "/comments/:commentId",
  isLogin,
  asyncHandler(deleteComment),
);
export default commentRouter;

import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { CommentService } from "./comment.service.js";
const commentService = new CommentService();
export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { content } = req.body;

  const taskId = req.params.taskId;
  const userName = req?.user?.userName;
  const authorId = req.user?.id;
  const data = await commentService.createComment({
    authorId,
    content,
    taskId,
    userName,
  });
  res.status(200).json({
    status: true,
    data: data,
  });
};
export const getTaskComments = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { taskId } = req.body;
  const id = req.user?.id;
  const data = await commentService.getTaskComments(taskId, id);
  res.status(200).json({ status: true, data: data });
};
export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { content } = req.body;
  const commentId = req.params.commentId;
  const userId = req.user?.id;
  const data = await commentService.updateComment(commentId, content, userId);
  res.status(200).json({ status: true, data: data });
};
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;
  const data = await commentService.deleteComment(commentId, userId);
  res.status(200).json({ status: true, data: data });
};

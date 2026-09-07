import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { FileService } from "./file.service.js";
const fileService = new FileService();

export const uploadTaskFile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const file = req.file;
  if (!file)
    return res.status(400).json({ status: false, message: "file is required" });
  const taskId = req.params.taskId;
  const userId = req.user?.id;
  const result = await fileService.uploadTaskFile(file, userId, taskId);
  return res.status(201).json({
    status: true,
    data: result,
  });
};
export const uploadWorkSpaceFile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const file = req.file;
  if (!file)
    return res.status(400).json({ status: false, message: "file is required" });
  const workSpaceId = req.params.workSpaceId;
  const userId = req.user?.id;
  const result = await fileService.uploadWorkSpaceFile(
    file,
    userId,
    workSpaceId,
  );
  return res.status(201).json({
    status: true,
    data: result,
  });
};
export const uploadProjectFile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const file = req.file;
  if (!file)
    return res.status(400).json({ status: false, message: "file is required" });
  const projectId = req.params.projectId;
  const userId = req.user?.id;
  const result = await fileService.uploadProjectFile(file, userId, projectId);
  return res.status(201).json({
    status: true,
    data: result,
  });
};
export const uploadCommentFile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const file = req.file;
  if (!file)
    return res.status(400).json({ status: false, message: "file is required" });
  const commentId = req.params.commentId;
  const userId = req.user?.id;
  const result = await fileService.uploadCommentFile(file, userId, commentId);
  res.status(201).json({ status: true, data: result });
};
export const getFileById = async (req: AuthenticatedRequest, res: Response) => {
  const fileId = req.params.fileId;
  const userId = req.user?.id;
  const result = await fileService.getFileById(fileId);
  return res.status(200).json({
    status: true,
    data: result,
  });
};
export const getFilesByTaskId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const taskId = req.params.taskId;
  const userId = req.user?.id;
  const result = await fileService.getFilesByTaskId(taskId);
  return res.status(200).json({
    status: true,
    data: result,
  });
};
export const getFilesByProjectId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const projectId = req.params.projectId;
  const userId = req.user?.id;
  const result = await fileService.getFilesByProjectId(projectId);
  return res.status(200).json({
    status: true,
    data: result,
  });
};
export const getFilesByWorkSpaceId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const workSpaceId = req.params.workSpaceId;
  const userId = req.user?.id;
  const result = await fileService.getFilesByWorkSpaceId(workSpaceId);
  return res.status(200).json({
    status: true,
    data: result,
  });
};

import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import { upload } from "../../config/multer.js";
import {
  getFileById,
  getFilesByProjectId,
  getFilesByTaskId,
  getFilesByWorkSpaceId,
  uploadCommentFile,
  uploadTaskFile,
} from "./file.controller.js";

const fileRouter = Router();

fileRouter.post(
  "/task/:taskId",
  isLogin,
  upload.single("file"),
  asyncHandler(uploadTaskFile),
);
fileRouter.post(
  "/workspace/:workSpaceId",
  isLogin,
  upload.single("file"),
  asyncHandler(uploadTaskFile),
);
fileRouter.post(
  "/project/:projectId",
  isLogin,
  upload.single("file"),
  asyncHandler(uploadTaskFile),
);
fileRouter.post(
  "/comment/:commentId",
  isLogin,
  upload.single("file"),
  asyncHandler(uploadCommentFile),
);
fileRouter.get("/:fileId", isLogin, asyncHandler(getFileById));
fileRouter.get("/task/:taskId", isLogin, asyncHandler(getFilesByTaskId));
fileRouter.get(
  "/workspace/:workSpaceId",
  isLogin,
  asyncHandler(getFilesByWorkSpaceId),
);
fileRouter.get(
  "/project/:projectId",
  isLogin,
  asyncHandler(getFilesByProjectId),
);
export default fileRouter;

import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import {
  assignTask,
  createTask,
  deleteTask,
  getMyAssignedTasks,
  getMyCreatedTasks,
  getTaskById,
  getTasksByProject,
  unassignTask,
  updateTask,
  updateTaskPriority,
  updateTaskStatus,
} from "./task.controller.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";

const taskRouter = Router();

taskRouter.post("/createNew", isLogin, asyncHandler(createTask));
taskRouter.get("/created/me", isLogin, asyncHandler(getMyCreatedTasks));
taskRouter.get("/assigned/me", isLogin, asyncHandler(getMyAssignedTasks));
taskRouter.get("/project/:projectId", isLogin, asyncHandler(getTasksByProject));
taskRouter.get("/:id", isLogin, asyncHandler(getTaskById));
taskRouter.patch("/:id", isLogin, asyncHandler(updateTask));
taskRouter.patch("/:id/status", isLogin, asyncHandler(updateTaskStatus));
taskRouter.patch("/:id/priority", isLogin, asyncHandler(updateTaskPriority));
taskRouter.patch("/:id/assign", isLogin, asyncHandler(assignTask));
taskRouter.patch("/:id/unassign", isLogin, asyncHandler(unassignTask));
taskRouter.delete("/:id", isLogin, asyncHandler(deleteTask));

export default taskRouter;

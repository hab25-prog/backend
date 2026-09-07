import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { AppError } from "../../shared/errors/AppError.js";
import { TaskService } from "./task.service.js";
import type { TaskPriority, TaskStatus } from "./task.repository.js";

const taskService = new TaskService();

const getRouteParam = (req: AuthenticatedRequest, name: string) => {
  const value = req.params[name];

  if (typeof value !== "string") {
    throw new AppError(`${name} is required`, 400);
  }

  return value;
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, projectId, assigneeId, status, priority } =
    req.body;
  const creatorId = req.user?.id || "";

  const task = await taskService.createNewTask({
    title,
    projectId,
    creatorId,
    ...(description !== undefined ? { description } : {}),
    ...(assigneeId !== undefined ? { assigneeId } : {}),
    ...(status !== undefined ? { status: status as TaskStatus } : {}),
    ...(priority !== undefined ? { priority: priority as TaskPriority } : {}),
  });

  res.status(201).json({ status: true, data: task });
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  const id = getRouteParam(req, "id");
  const userId = req.user?.id;
  const task = await taskService.getTask(id, userId);

  res.status(200).json({ status: true, data: task });
};

export const getTasksByProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const projectId = getRouteParam(req, "projectId");
  const userId = req.user?.id;
  const tasks = await taskService.getProjectTasks(projectId, userId);

  res.status(200).json({ status: true, data: tasks });
};

export const getMyCreatedTasks = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const creatorId = req.user?.id || "";
  const tasks = await taskService.getCreatedTasks(creatorId);

  res.status(200).json({ status: true, data: tasks });
};

export const getMyAssignedTasks = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const assigneeId = req.user?.id || "";
  const tasks = await taskService.getAssignedTasks(assigneeId);

  res.status(200).json({ status: true, data: tasks });
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const id = getRouteParam(req, "id");
  const userId = req.user?.id;
  const { title, description, status, priority, projectId, assigneeId } =
    req.body;

  const task = await taskService.updateTask(id, userId, {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(status !== undefined ? { status: status as TaskStatus } : {}),
    ...(priority !== undefined ? { priority: priority as TaskPriority } : {}),
    ...(projectId !== undefined ? { projectId } : {}),
    ...(assigneeId !== undefined ? { assigneeId } : {}),
  });

  res.status(200).json({ status: true, data: task });
};

export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = getRouteParam(req, "id");
  const { status } = req.body;
  const userId = req.user?.id;
  const task = await taskService.updateStatus(id, userId, status as TaskStatus);

  res.status(200).json({ status: true, data: task });
};

export const updateTaskPriority = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = getRouteParam(req, "id");
  const userId = req.user?.id;
  const { priority } = req.body;
  const task = await taskService.updatePriority(
    id,
    userId,
    priority as TaskPriority,
  );

  res.status(200).json({ status: true, data: task });
};

export const assignTask = async (req: AuthenticatedRequest, res: Response) => {
  console.log(" we are in task assign controller");
  const id = getRouteParam(req, "id");
  const { assigneeId } = req.body;
  const userId = req.user?.id;
  const task = await taskService.assignTask(id, userId, assigneeId);

  res.status(200).json({ status: true, data: task });
};

export const unassignTask = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = getRouteParam(req, "id");
  const userId = req.user?.id;
  const task = await taskService.unassignTask(id, userId);

  res.status(200).json({ status: true, data: task });
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const id = getRouteParam(req, "id");
  const userId = req.user?.id;
  await taskService.deleteTask(id, userId);

  res.status(200).json({ status: true, message: "task deleted successfully" });
};

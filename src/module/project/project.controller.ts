import type { Request, Response } from "express";
import { ProjectRepository } from "./project.repository.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ProjectService } from "./project.service.js";

const projectService = new ProjectService();

export const newProject = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, workSpaceId, endDate } = req.body;
  const ownerId = req.user?.id;
  const dueDate: Date = new Date(endDate);
  const proj = await projectService.createNewPorject({
    name,
    description,
    ownerId,
    workspaceId: workSpaceId,
    dueDate,
  });

  res.status(200).json({ satus: true, data: proj });
};
export const getProjectById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const proj = await projectService.getProject(id, userId);
  res.status(200).json({ status: true, data: proj });
};
export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { projectId } = req.params;
  const id = req.user?.id as string;
  const project = await projectService.deleteProject(id, projectId as string);
  res
    .status(200)
    .json({ status: true, message: "the item delered sucessfully" });
};
export const addNewMeber = async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;
  const id = req.user?.id;
  const data = await projectService.addMember({
    actorId: id as string,
    projectId: projectId as string,
    role: role,
    userId: userId,
  });
  res.status(200).json({ status: true, data });
};
export const getAllMember = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const projectId = req.params.projectId;
  const data = await projectService.getAllMember(projectId, userId);
};
export const updateRole = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const userId= req.params.userId
  const { projectId, role } = req.body;
  const data = await projectService.updateRole(
    id,
    projectId,
    userId,
    role,
  );
  res.status(200).json({ status: true, data: data });
};
export const removeMember = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.params.userId;
  const id = req.user?.id;
  const { projectId } = req.body;
  const data = await projectService.removeMember(userId, projectId, id);
  res.status(201).json({ status: true, data });
};

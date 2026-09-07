import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { WorkSpaceService } from "./workSpace.service.js";
import type { Response } from "express";

const workSpaceService = new WorkSpaceService();

export const createWorkSpace = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { name, description = null } = req.body;
  const ownerId = req.user?.id;
  const data = await workSpaceService.createWorkSpace(
    name,
    ownerId as string,
    description,
  );
  res.status(200).json({ status: true, data: data });
};
export const addUser = async (req: AuthenticatedRequest, res: Response) => {
  const { workSpaceId, userId, role } = req.body;
  // this is debuging purpose
  // console.log(" the role that changefd for user is heir", role);
  const id = req.user?.id as string;
  const data = await workSpaceService.addUser(id, workSpaceId, userId, role);
  res.status(200).json({ status: true, data: data });
};
export const removeUser = async (req: AuthenticatedRequest, res: Response) => {
  const { memberShipId, workSpaceId } = req.body;
  const id = req.user?.id;
  const data = await workSpaceService.removeMember(
    memberShipId,
    id as string,
    workSpaceId,
  );
  res
    .status(200)
    .json({ status: true, message: "user is successfully reomved" });
};
export const updateRole = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const { memberShipId, role, workSpaceId } = req.body;
  const data = await workSpaceService.updateWorkSpaceRole(
    id,
    memberShipId,
    role,
    workSpaceId,
  );
  res.status(200).json({ status: true, data: data });
};
export const getMembers = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.body;
  const members = await workSpaceService.getAllWorkSpaceMember(id);
  res.status(200).json({ status: true, data: members });
};

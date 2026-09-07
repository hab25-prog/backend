import type { WorkspaceRole } from "../../../generated/prisma/enums.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { WorkSpaceRepository } from "./workSpace.repository.js";
import { NotificationService } from "../Notification/notification.service.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import type { UpdateMemberRole } from "./workspace.type.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { CreateNotificationInput } from "../Notification/notification.types.js";

const workSpaceRepository = new WorkSpaceRepository();
const notificationService = new NotificationService();
export class WorkSpaceService {
  private async isOner(workSpaceId: string, userId: string) {
    const own = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workSpaceId,
    );
    if (own?.role !== "OWNER") return false;
    if (own.role == "OWNER") return true;
  }
  async createWorkSpace(
    name: string,
    ownerId: string,
    description?: string,
    role = "OWNER",
  ) {
    const workS = await workSpaceRepository.createWorkSpace({
      name,
      ...(description && { description }),
      ownerId,
    });
    if (!workS) {
      throw new NoteFoundError("the work space is not created !");
    }

    return workS;
  }
  async addUser(
    ownerId: string,
    workSpaceId: string,
    userId: string,
    role: string,
  ) {
    const d = await workSpaceRepository.getWorkSpaceById(workSpaceId);
    if (!d) {
      throw new NoteFoundError("Workspace was not found");
    }
    if (d.ownerId !== ownerId)
      throw new ForbiddenError("this action must done by work space owner");
    const member = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workSpaceId,
    );
    if (member)
      throw new ConflictError(
        "the user alerady the member of the worke space ",
      );
    const res = await workSpaceRepository.addWorkSpaceMember(
      workSpaceId,
      userId,
      role as WorkspaceRole,
    );
    if (!res) {
      throw new NoteFoundError(
        "the user is not add to this work space please try again",
      );
    }
    await notificationService.createNotification({
      recipientId: res.userId,
      type: "WORKSPACE_INVITED",
      title: "Workspace invitation",
      message: `You were invited to join the workspace: ${d.name}`,
      actionUrl: `/workSpace/${d.id}`,
      metadata: { workspaceId: d.id, ownerId },
    });
    return res;
  }
  async removeMember(id: string, userId: string, workSpaceId: string) {
    const workspace = await workSpaceRepository.getWorkSpaceById(workSpaceId);
    if (workspace?.ownerId != userId)
      throw new ForbiddenError("you can not do this action");
    const member = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workSpaceId,
    );
    if (member?.id == id)
      throw new ForbiddenError(
        " you can not reomve your self you can be delet the work space",
      );
    const message = await workSpaceRepository.removeMember(id);
    return message;
  }
  async getMemberShip(workSpaceId: string, userId: any) {
    const member = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workSpaceId,
    );
    return member;
  }
  async getAllWorkSpaceMember(workSpaceId: string) {
    const workspace = await workSpaceRepository.getAllMember(workSpaceId);
    if (!workspace)
      throw new NoteFoundError("their is no user in this work space");
    return await workspace;
  }
  async getWorkSpaceById(id: string) {
    const work_space = await workSpaceRepository.getWorkSpaceById(id);
    return work_space;
  }
  // async getWorkSpaceByUserId(userId: string){
  //   const workSpace= await workSpaceRepository.
  // }
  async updateWorkSpaceRole(
    ownerId: any,
    id: string,
    role: string,
    workSpaceId: string,
  ) {
    const check = await this.isOner(workSpaceId, ownerId);
    if (!check) throw new UnauthorizedError("you can not change the user role");
    const change = await workSpaceRepository.updateMemberRole({
      id,
      role,
    } as UpdateMemberRole);
    if (!change)
      throw new AppError(
        "internal error it may be fix after amoment please com back",
        501,
      );
    const notf = await notificationService.createNotification({
      message: "your role is changed",
      recipientId: change.userId,
      title: "Work Space Role Change",
      type: "WORKSPACE_ROLE_CHANGED",
    } as CreateNotificationInput);
    return change;
  }
}

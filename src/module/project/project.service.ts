import { check } from "zod";
import { Role } from "../../../generated/prisma/enums.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { ActivityService } from "../activity/activity.service.js";
import type { CreateActivityInput } from "../activity/activity.types.js";
import { NotificationService } from "../Notification/notification.service.js";
import { UserRepository } from "../user/user.repository.js";
import { WorkSpaceRepository } from "../work_space/workSpace.repository.js";
import { ProjectRepository } from "./project.repository.js";
import type { UpdateRole } from "./project.types.js";

const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();
const workSpaceRepository = new WorkSpaceRepository();
const notificationService = new NotificationService();
const activityService = new ActivityService();

export class ProjectService {
  private async ensureWorkspaceMember(
    workspaceId: string,
    userId: any,
  ): Promise<boolean> {
    console.log("userId ", userId);
    console.log("workspace Id ", workspaceId);
    const member = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workspaceId,
    );
    console.log("the member is", member);
    return Boolean(member);
  }

  async createNewPorject(data: {
    name: string;
    description?: string;
    ownerId: any;
    workspaceId: string;
    dueDate: Date;
  }) {
    const member = await this.ensureWorkspaceMember(
      data.workspaceId,
      data.ownerId,
    );

    if (!member) {
      throw new ForbiddenError(
        "you must be a member of this workspace to create a project",
      );
    }

    const proj = await projectRepository.createProject(data);

    if (!proj) {
      throw new NoteFoundError("project was not created");
    }

    await activityService.createActivity({
      action: "CREATE",
      targetType: "PROJECT",
      targetId: proj.id,
      actorId: proj.ownerId,
      workspaceId: proj.workspaceId,
      projectId: proj.id,
      metadata: {
        message: "project created successfully",
      },
    } as CreateActivityInput);

    return proj;
  }

  async getProject(projectId: any, userId: any) {
    if (!projectId) {
      throw new ForbiddenError("project must be selected");
    }

    if (!userId) {
      throw new UnauthorizedError("you must be logged in");
    }

    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new NoteFoundError("project was not found");
    }

    const member = await workSpaceRepository.getWorkSpaceMember(
      userId,
      project.workspaceId,
    );

    if (!member) {
      throw new ForbiddenError(
        "you must be a member of the workspace to view this project",
      );
    }

    return project;
  }
  async addMember(data: {
    actorId: string;
    userId: string;
    projectId: string;
    role: string;
  }) {
    const proj = await projectRepository.findById(data.projectId);
    if (!proj) throw new NoteFoundError("project is not found");
    const member = await projectRepository.getMember(
      data.userId,
      data.projectId,
    );
    if (member) {
      throw new ConflictError("user alerady the member of the project");
    }
    const members = await projectRepository.getMember(
      data.actorId,
      data.projectId,
    );
    if (data.actorId != proj?.ownerId)
      if (members?.role !== "ADMIN")
        throw new UnauthorizedError("you can not add user to this project");

    const workSpace = await workSpaceRepository.getAllMember(proj.workspaceId);
    const check = workSpace.find((w) => w.userId == data.userId);
    if (!check) {
      throw new NoteFoundError(
        "the user should be on the same workSpace with project",
      );
    }

    const response = await projectRepository.addMember(
      data.userId,
      data.projectId,
      data.role,
    );
    await notificationService.createNotification({
      message: "You were invited to join this project.",
      recipientId: response.userId,
      type: "PROJECT_INVITED",
      title: "Project invitation",
      actionUrl: `/project/${data.projectId}`,
      metadata: {
        projectId: response.projectId,
        ownerId: data.actorId,
      },
    });
    activityService.createActivity({
      action: "INVITE",
      targetId: response.projectId,
      targetType: "PROJECT",
      actorId: data.actorId,
      projectId: response.projectId,
    } as CreateActivityInput);
    return response;
  }
  async removeMember(userId: any, projectId: string, ownerId: any) {
    const data = await projectRepository.getMember(ownerId, projectId);
    if (data?.role !== "OWNER")
      throw new ForbiddenError("you are not allowed to remove members");
    const member = await projectRepository.getMember(userId, projectId);
    if (!member)
      throw new NoteFoundError("the user is not the member of this project");
    const res = await projectRepository.removeMember(userId, projectId);
    if (!res) {
      throw new ForbiddenError("you cant remove a member of this ");
    }
    const project = await projectRepository.getProjectById(res.projectId);

    await activityService.createActivity({
      action: "REMOVE",
      targetId: res.projectId,
      targetType: "PROJECT",
      actorId: ownerId,
      projectId: res.projectId,
    } as CreateActivityInput);
    await notificationService.createNotification({
      message: `you are removed from the project ${project?.name}`,
      recipientId: userId,
      title: "removed from project",
      type: "PROJECT_MEMBER_REMOVE",
    });
    return { message: "sucessfully removed " };
  }
  async updateRole(ownerId: any, projectId: string, userId: any, role: string) {
    const Check = await projectRepository.getMember(ownerId, projectId);
    if (Check?.role !== "OWNER" && Check?.role !== "ADMIN")
      throw new ForbiddenError("you can not change the role of user");
    const member = await projectRepository.getMember(userId, projectId);
    if (!member) throw new NoteFoundError("the project member is not found");
    if (member.role === "OWNER")
      throw new ForbiddenError("you can not change the owners role");
    if (member.role === "ADMIN" && Check.role !== "OWNER")
      throw new ForbiddenError("admins can be chage role by owner only");
    if (role === "OWNER") {
      throw new ForbiddenError("you can not assign the OWNER role");
    }
    const data = await projectRepository.ChangeRole({
      id: member?.id,
      role: role,
    } as UpdateRole);
    if (!data) throw new AppError("the action is not taken", 501);
    await notificationService.createNotification({
      message: `The Role Is Changed To ${data.role}`,
      recipientId: data.userId,
      title: "Role Change",
      type: "PROJECT_ROLE_CHANGED",
    });
    return data;
  }

  async deleteProject(userId: string, projectId: string) {
    const role = await projectRepository.getRole(userId, projectId);
    if (role != "OWNER")
      throw new UnauthorizedError("you can not delete this project");
    const project = await projectRepository.deleteProject(projectId);
    if (!project) throw new ForbiddenError("the other uknown error");
    activityService.createActivity({
      action: "DELETE",
      targetType: "PROJECT",
      targetId: projectId,
      actorId: userId,
      metadata: {
        message: "project is archived successfully",
      },
    } as CreateActivityInput);
    return project;
  }
  async getAllMember(porjectId: any, userId: any) {
    const project = await projectRepository.findById(porjectId);
    if (!project) throw new NoteFoundError("the project is not found");
    const workSpaceMember = await workSpaceRepository.getAllMember(
      project?.workspaceId,
    );
    if (workSpaceMember.some((m) => m.userId == userId))
      throw new ForbiddenError("you can't get this data");
    const members = await projectRepository.getAllMember(porjectId);
    return members;
  }
  async getMember(userId: any, projectId: string) {
    const member = await projectRepository.getMember(userId, projectId);
    return member;
  }
}

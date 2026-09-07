import { ActivityRepository } from "./activity.repository.js";
import type {
  CreateActivityInput,
  GetProjectActivitiesInput,
  GetTaskActivitesInpute,
  GetWorkspaceActivitiesInput,
} from "./activity.types.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { ProjectRepository } from "../project/project.repository.js";
import { TaskRepository } from "../task/task.repository.js";
import { WorkSpaceRepository } from "../work_space/workSpace.repository.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";

const activityRepository = new ActivityRepository();
const workSpaceRepository = new WorkSpaceRepository();
const projectRepository = new ProjectRepository();
const taskRepository = new TaskRepository();

export class ActivityService {
  private async ensureWorkspaceMember(workSpaceId: string, userId: string) {
    const member = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workSpaceId,
    );
    return Boolean(member);
  }
  private async ensureProjectMember(
    projectId: string,
    userId: string,
    workSpaceId: string,
  ) {
    const [member, workspace] = await Promise.all([
      projectRepository.getMember(userId, projectId),
      workSpaceRepository.getWorkSpaceById(workSpaceId),
    ]);
    return Boolean(member) || workspace?.ownerId === userId;
  }
  async createActivity(data: CreateActivityInput) {
    const resp = await activityRepository.create({
      workspaceId: data.workspaceId,
      projectId: data.projectId,
      taskId: data.taskId,
      action: data.action,
      actorId: data.actorId,
      targetId: data.targetId,
      targetType: data.targetType,
      metadata: data.metadata,
    } as CreateActivityInput);
  }

  async getWorkspaceActivities(workSpaceId: any, userId: any) {
    const check = await this.ensureWorkspaceMember(workSpaceId, userId);
    if (!check)
      throw new ForbiddenError(" you are not a member of this work space");
    const data = await activityRepository.findWorkspaceActivities({
      workSpaceId: workSpaceId,
    } as GetWorkspaceActivitiesInput);
    return data;
  }

  async getProjectActivities(projectId?: any, userId?: any) {
    if (!projectId) throw new ForbiddenError("their must be project selected");
    if (!userId) throw new ForbiddenError("you must be logged in user");
    const project = await projectRepository.getProjectById(projectId);

    if (!project) {
      throw new ForbiddenError("project was not found");
    }

    const check = await this.ensureProjectMember(
      projectId,
      userId,
      project.workspaceId,
    );

    if (!check) {
      throw new ForbiddenError("you are not eligible to get this information");
    }

    const activity = await activityRepository.findProjectActivities({
      projectId,
    } as GetProjectActivitiesInput);

    return activity;
  }

  async getTaskActivities(taskId: any, userId: any) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ForbiddenError("task was not found");
    }
    const project = await projectRepository.getProjectById(task.projectId);
    if (!project) {
      throw new ForbiddenError("project was not found");
    }

    const check = await this.ensureProjectMember(
      task.projectId,
      userId,
      project.workspaceId,
    );
    if (!check)
      throw new ForbiddenError("you are not elgible to get this information");
    const taskActivity = await activityRepository.findTaskActivites({
      taskId,
    } as GetTaskActivitesInpute);
    return taskActivity;
  }
}

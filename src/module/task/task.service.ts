import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import {
  TaskRepository,
  type TaskPriority,
  type TaskStatus,
} from "./task.repository.js";
import { NotificationService } from "../Notification/notification.service.js";
import { ActivityService } from "../activity/activity.service.js";
import type { CreateActivityInput } from "../activity/activity.types.js";
import { ProjectRepository } from "../project/project.repository.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { WorkSpaceRepository } from "../work_space/workSpace.repository.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";

const taskRepository = new TaskRepository();
const notificationService = new NotificationService();
const activityService = new ActivityService();
const workspaceRepo = new WorkSpaceRepository();
const projectRepository = new ProjectRepository();

export class TaskService {
  async createNewTask(data: {
    title: string;
    description?: string;
    projectId: string;
    creatorId: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }) {
    const member = await projectRepository.getAllMember(data.projectId);
    if (!member.some((m) => m.userId === data.creatorId))
      throw new ForbiddenError("you are not the member of this project");
    if (data.assigneeId)
      if (!member.some((m) => m.userId == data.assigneeId))
        throw new ForbiddenError(
          "the assigned user is not the member of this project",
        );
    const task = await taskRepository.createTask(data);

    if (!task) {
      throw new NoteFoundError("task is not created");
    }

    await this.notifyAssignee(task);
    activityService.createActivity({
      action: "CREATE",
      targetId: task.id,
      targetType: "TASK",
      actorId: task.creatorId,
      taskId: task.id,
      metadata: {
        " message": "task is created ",
      },
    } as CreateActivityInput);

    return task;
  }

  async getTask(id: string, userId: any) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NoteFoundError("task is not found");
    }
    const project = await projectRepository.findById(task?.projectId);
    if (!project) throw new NoteFoundError("project is not found");
    const workspaceMember = await workspaceRepo.getAllMember(
      project?.workspaceId,
    );
    if (!workspaceMember.some((m) => m.userId === userId))
      throw new ForbiddenError("you are not the member of this work space");
    return task;
  }

  async getProjectTasks(projectId: string, userId: any) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new NoteFoundError("project is note found");
    console.log(project.workspaceId);
    const workSpaceMember = await workspaceRepo.getWorkSpaceMember(
      userId,
      project?.workspaceId,
    );
    console.log("PROJECT ID:", projectId);
    console.log("WORKSPACE ID:", project.workspaceId);
    console.log("USER ID:", userId);
    if (!workSpaceMember)
      throw new ForbiddenError("you are not elgible to get this information");
    return await taskRepository.findManyByProject(projectId);
  }

  async getCreatedTasks(creatorId: string) {
    return await taskRepository.findManyByCreator(creatorId);
  }

  async getAssignedTasks(assigneeId: string) {
    return await taskRepository.findManyByAssignee(assigneeId);
  }

  async updateTask(
    id: string,
    userId: any,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      projectId?: string;
      assigneeId?: string | null;
    },
  ) {
    const currentTask = await this.getTask(id, userId);
    if (currentTask.assigneeId !== userId)
      throw new UnauthorizedError("you are note assgined for this task");
    const task = await taskRepository.updateTask(id, data);

    if (
      data.assigneeId !== undefined &&
      data.assigneeId !== null &&
      currentTask.assigneeId !== data.assigneeId
    ) {
      await this.notifyAssignee(task);
    }

    return task;
  }

  async updateStatus(id: string, userId: any, status: TaskStatus) {
    const task = await this.getTask(id, userId);
    if (task.assigneeId !== userId)
      throw new ForbiddenError("you are not assgined for this task");
    return await taskRepository.updateStatus(id, status);
  }

  async updatePriority(id: string, userId: any, priority: TaskPriority) {
    const task = await this.getTask(id, userId);
    if (task.creatorId !== userId)
      throw new ForbiddenError(
        "you are not elgible to update this data of task",
      );
    return await taskRepository.updatePriority(id, priority);
  }

  async assignTask(id: string, userId: any, assigneeId: string) {
    const currentTask = await this.getTask(id, userId);
    const member = await projectRepository.getMember(
      userId,
      currentTask.projectId,
    );
    if (member?.role !== "ADMIN" && member?.role !== "OWNER")
      throw new ForbiddenError("you are not elgible to assgine any task");
    const assignee = await projectRepository.getMember(
      assigneeId,
      currentTask.projectId,
    );
    if (!assignee)
      throw new ForbiddenError("the user is not the member of this project");
    const task = await taskRepository.assignTask(id, assigneeId);

    if (currentTask.assigneeId !== assigneeId) {
      await this.notifyAssignee(task);
    }
    activityService.createActivity({
      action: "ASSIGN",
      targetId: task.id,
      targetType: "TASK",
      actorId: task.assigneeId,
      taskId: task.id,
      metadata: {
        message: "the task is assgined for one user ",
      },
    } as CreateActivityInput);
    return task;
  }

  async unassignTask(id: string, userId: any) {
    const task = await this.getTask(id, userId);
    const member = await projectRepository.getMember(userId, task.projectId);
    if (member?.role !== "ADMIN" && member?.role !== "OWNER")
      throw new ForbiddenError(
        "you are not elgible to unassgine task any task",
      );
    const data = await taskRepository.unassignTask(id);
    activityService.createActivity({
      action: "UNASSIGN",
      targetId: data.id,
      targetType: "TASK",
      actorId: data.creatorId,
      metadata: {
        message: "task is unassigne for the user",
      },
    } as CreateActivityInput);
    return data;
  }

  async deleteTask(id: string, userId: any) {
    const task = await this.getTask(id, userId);
    const member = await projectRepository.getMember(userId, task.projectId);
    if (member?.role == "MEMBER" || task.creatorId !== userId)
      throw new ForbiddenError("you can not delete this task");
    return await taskRepository.deleteTask(id);
  }

  private async notifyAssignee(task: {
    id: string;
    title: string;
    projectId: string;
    creatorId: string;
    assigneeId: string | null;
  }) {
    if (!task.assigneeId || task.assigneeId === task.creatorId) {
      return;
    }

    await notificationService.createNotification({
      recipientId: task.assigneeId,
      type: "TASK_ASSIGNED",
      title: "Task assigned",
      message: `You were assigned to the task: ${task.title}`,
      actionUrl: `/task/${task.id}`,
      metadata: { taskId: task.id, projectId: task.projectId },
    });
  }
}

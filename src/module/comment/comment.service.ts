import type { Project$membersArgs } from "../../../generated/prisma/models.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { ActivityService } from "../activity/activity.service.js";
import type { CreateActivityInput } from "../activity/activity.types.js";
import { NotificationService } from "../Notification/notification.service.js";
import type { CreateNotificationInput } from "../Notification/notification.types.js";
import { ProjectRepository } from "../project/project.repository.js";
import { ProjectService } from "../project/project.service.js";
import type { GetProjectMember } from "../project/project.types.js";
import { TaskService } from "../task/task.service.js";
import { CommentRepository } from "./comment.repository.js";
import type { CreateCommentInput } from "./comment.types.js";

const commentRepository = new CommentRepository();
const projectService = new ProjectRepository();
const taskService = new TaskService();
const notificationService = new NotificationService();
const activityService = new ActivityService();
export class CommentService {
  async createComment(data: {
    authorId: any;
    content?: string;
    taskId: any;
    userName: any;
  }) {
    const task = await taskService.getTask(data.taskId, data.authorId);
    const proj = await projectService.getAllMember(task.projectId);
    this.ensureMembership(proj as GetProjectMember, data.authorId);
    const update = data.content?.replaceAll(" ", "");
    // console.log("updated content", update?.replace(" ", "_"));
    if (!update && update === "")
      throw new ConflictError("content is required");
    const response = await commentRepository.create({
      authorId: data.authorId,
      content: data.content,
      taskId: data.taskId,
    } as CreateCommentInput);
    activityService.createActivity({
      action: "CREATE",
      targetId: response.id,
      targetType: "COMMENT",
      actorId: data.authorId,
      metadata: {
        message: " commentd on task",
      },
    } as CreateActivityInput);
    notificationService.createNotification({
      message: `user ${data.userName} commented on your `,
      recipientId: task.assigneeId,
      title: "comment on task",
      type: "COMMENT_ADDED",
    } as CreateNotificationInput);
    return response;
  }
  async getTaskComments(taskId: string, userId: any) {
    const task = await taskService.getTask(taskId, userId);
    if (!task) throw new NoteFoundError("task not found");
    const projM = await projectService.getAllMember(task.projectId);
    this.ensureMembership(projM as GetProjectMember, userId);
    const response = await commentRepository.findByTask(taskId);
    return response;
  }
  async updateComment(commentId: any, content: string, userId: any) {
    const coment = await commentRepository.findById(commentId);
    if (!coment) throw new NoteFoundError("comment not found");
    if (coment?.authorId != userId)
      throw new UnauthorizedError(" you cant edit this comment");
    const task = await taskService.getTask(coment?.taskId as string, userId);

    const response = await commentRepository.update(commentId, content);
    activityService.createActivity({
      action: "UPDATE",
      targetId: response.id,
      targetType: "COMMENT",
      actorId: userId,
    } as CreateActivityInput);
    notificationService.createNotification({
      message: "user is updated their comment ",
      recipientId: task.assigneeId,
      title: "comment changed",
      type: "COMMENT_ADDED",
    } as CreateNotificationInput);
    return response;
  }
  async deleteComment(id: any, userId: any) {
    const coment = await commentRepository.findById(id);
    if (!coment) throw new NoteFoundError("comment not found");
    if (coment?.authorId != userId)
      throw new ForbiddenError(" you cant delete this comment");
    const response = await commentRepository.delete(id);
    activityService.createActivity({
      action: "DELETE",
      targetId: response.id,
      targetType: "COMMENT",
      actorId: userId,
    } as CreateActivityInput);
    return response;
  }
  async getCommentById(id: string, userId: string) {
    const comment = await commentRepository.findById(id);
    if (comment?.authorId != userId)
      throw new UnauthorizedError(
        "you can not access this comment this is not belong to you",
      );
    return comment;
  }
  private ensureMembership(members: GetProjectMember, authorId: string): void {
    const isMember = members.some((member) => member.userId === authorId);
    if (!isMember) {
      throw new ForbiddenError("You are not a member of this project");
    }
  }
}

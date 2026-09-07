import { FileRepository } from "./file.repository.js";
import { LocalStorage } from "../../infrastructure/storage/local.storage.js";
import { TaskService } from "../task/task.service.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { isAllowedMimeType } from "./file.validation.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { CreateFileInput } from "./file.types.js";
import { ActivityService } from "../activity/activity.service.js";
import { NotificationService } from "../Notification/notification.service.js";
import type { CreateActivityInput } from "../activity/activity.types.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { WorkSpaceRepository } from "../work_space/workSpace.repository.js";
import { ProjectService } from "../project/project.service.js";
import { CommentService } from "../comment/comment.service.js";

const fileRepository = new FileRepository();
const storageService = new LocalStorage();
const taskService = new TaskService();
const activityService = new ActivityService();
const notificationService = new NotificationService();
const workSpaceRepository = new WorkSpaceRepository();
const projectService = new ProjectService();
const commentService = new CommentService();

export class FileService {
  async uploadTaskFile(file: Express.Multer.File, userId: any, taskId: any) {
    const task = await taskService.getTask(taskId, userId);
    // 1. Check task
    if (!task) throw new NoteFoundError(" task is not heir");
    // 2. Check user permission
    if (task.assigneeId != userId)
      throw new ForbiddenError(
        "you can not add file for this task you are not assgind",
      );
    // 3. Validate file
    if (!isAllowedMimeType(file.mimetype))
      throw new ForbiddenError("this type of file is not allowed to upload");
    // 4. validate the file is not empity
    if (file.size <= 0)
      throw new AppError(" the file must should not be empity ", 404);
    let fileStored;
    try {
      // 5. Save physical file
      fileStored = await storageService.save(file);
      // 6. Save database record
      const res = await fileRepository.create({
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        storageKey: fileStored.storageKey,
        storedName: fileStored.storedName,
        uploadedById: userId,
        taskId: taskId,
      } as CreateFileInput);
      // 7. Create activity
      activityService.createActivity({
        action: "UPLOAD",
        targetId: res.id,
        targetType: "FILE",
        actorId: userId,
        taskId: taskId,
      } as CreateActivityInput);
      // 8. Return file information
      return res;
    } catch (error) {
      if (fileStored) await storageService.delete(fileStored.storageKey);
      console.log(error);
      throw new ConflictError(" their is internal datatbase error sorry");
    }
  }
  async uploadWorkSpaceFile(
    file: Express.Multer.File,
    userId: any,
    workSpaceId: any,
  ) {
    // 1. validate the file is not empity
    if (file.size <= 0)
      throw new AppError(" the file must should not be empity ", 404);
    // 2. validate the file mimic type
    if (!isAllowedMimeType(file.mimetype))
      throw new ForbiddenError("this type of file is not allowed to upload");
    // 3. check the work space is exist or not
    const workSpace = await workSpaceRepository.getWorkSpaceById(workSpaceId);
    const workSpaceMember = await workSpaceRepository.getWorkSpaceMember(
      userId,
      workSpaceId,
    );
    if (!workSpace) throw new NoteFoundError("work space is not found");
    // 4. check the user is allowed to upload file or not
    if (workSpaceMember === null)
      throw new ForbiddenError("you are not a member of this work space");
    let stordeFile;
    try {
      // 5. Save physical file
      stordeFile = await storageService.save(file);
      // 6. Save database record
      const res = await fileRepository.create({
        mimeType: file.mimetype,
        originalName: file.filename,
        size: file.size,
        storageKey: stordeFile.storageKey,
        storedName: stordeFile.storedName,
        uploadedById: userId,
        workspaceId: workSpaceId,
      } as CreateFileInput);
      // 7. Create activity
      activityService.createActivity({
        action: "UPLOAD",
        targetId: res.id,
        targetType: "FILE",
        actorId: userId,
        workspaceId: workSpaceId,
      } as CreateActivityInput);
      // 8. Return file information
      return res;
    } catch (error) {
      throw new ConflictError("their is internal datatbase error sorry");
      if (stordeFile) await storageService.delete(stordeFile.storageKey);
    }
  }
  async uploadProjectFile(
    file: Express.Multer.File,
    userId: any,
    projectId: any,
  ) {
    // 1. validate the file is not empity
    if (file.size <= 0)
      throw new AppError(" the file must should not be empity ", 404);
    // 2. validate the file mimic type
    if (!isAllowedMimeType(file.mimetype))
      throw new ForbiddenError("this type of file is not allowed to upload");
    // 3. check project is exist
    const project = await projectService.getProject(projectId, userId);
    if (!project) throw new NoteFoundError("project is not found");
    // 4. check the user is allowed to upload file or not
    if (project.ownerId !== userId)
      throw new ForbiddenError("you are not a member of this project");
    let stordeFile;
    try {
      // 4. Save physical file
      stordeFile = await storageService.save(file);
      // 5. Save database record
      const res = await fileRepository.create({
        mimeType: file.mimetype,
        originalName: file.filename,
        size: file.size,
        storageKey: stordeFile.storageKey,
        storedName: stordeFile.storedName,
        uploadedById: userId,
        projectId: projectId,
      } as CreateFileInput);
      // 6. Create activity
      activityService.createActivity({
        action: "UPLOAD",
        targetId: res.id,
        targetType: "FILE",
        actorId: userId,
        projectId: projectId,
      } as CreateActivityInput);
      // 7. Return file information
      return res;
    } catch (error) {
      if (stordeFile) await storageService.delete(stordeFile.storageKey);
      throw new ConflictError("their is internal datatbase error sorry");
    }
  }
  async uploadCommentFile(
    file: Express.Multer.File,
    userId: any,
    commentId: any,
  ) {
    // 1. vaidate is the file is exist
    if (file.size <= 0)
      throw new AppError("the file must should not be emipty ", 404);
    // 2. check the mimc type
    if (!isAllowedMimeType(file.mimetype))
      throw new ForbiddenError("this type of file is not allowed to upload");
    // 3. validate comment is exist
    const comment = await commentService.getCommentById(commentId, userId);
    if (!comment) throw new NoteFoundError(" comment is not exist");
    // 4. upload file to storage
    let storedFile;
    try {
      storedFile = await storageService.save(file);
      const res = await fileRepository.create({
        mimeType: file.mimetype,
        originalName: file.filename,
        size: file.size,
        storageKey: storedFile.storageKey,
        storedName: storedFile.storedName,
        uploadedById: userId,
        commentId: commentId,
      } as CreateFileInput);
    } catch (err) {
      if (storedFile) await storageService.delete(storedFile.storageKey);
      throw new ConflictError("their is internal datatbase error sorry");
    }
  }
  async getFileById(id: any) {
    const file = await fileRepository.findById(id);
    if (!file) throw new NoteFoundError("file is not found");
    return file;
  }
  async getFilesByTaskId(taskId: any) {
    const files = await fileRepository.findByTask(taskId);
    if (!files || files.length === 0)
      throw new NoteFoundError("files are not found for this task");
    return files;
  }
  async getFilesByProjectId(projectId: any) {
    const files = await fileRepository.findByProject(projectId);
    if (!files || files.length === 0)
      throw new NoteFoundError("files are not found for this project");
    return files;
  }
  async getFilesByWorkSpaceId(workSpaceId: any) {
    const files = await fileRepository.findByWorkspace(workSpaceId);
    if (!files || files.length === 0)
      throw new NoteFoundError("files are not found for this work space");
    return files;
  }
}

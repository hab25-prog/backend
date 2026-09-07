import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { ActivityService } from "../activity/activity.service.js";
import type { CreateActivityInput } from "../activity/activity.types.js";
import { NotificationService } from "../Notification/notification.service.js";
import type {
  CreateNotificationInput,
  CreateNotificationType,
} from "../Notification/notification.types.js";
import { ProjectService } from "../project/project.service.js";
import { UserService } from "../user/user.service.js";
import { WorkSpaceService } from "../work_space/workSpace.service.js";
import { MeetingParticipantRepository } from "./meeting-participant.repository.js";
import { MeetingRepository } from "./meeting.repository.js";
import type {
  AddMeetingParticipantInput,
  ChangeMeetingStatusInput,
  CreateMeetingInput,
  GetMeetingParticipant,
  UpdateMeetingInput,
} from "./meeting.types.js";

const meetingRepository = new MeetingRepository();
const workSpaceService = new WorkSpaceService();
const projectService = new ProjectService();
const activityService = new ActivityService();
const notificationService = new NotificationService();
const userService = new UserService();
const meetingParticipantRepository = new MeetingParticipantRepository();

export class MeetingService {
  private createBulkNotficiation(
    users: GetMeetingParticipant,
    chatType: ChangeMeetingStatusInput,
    notficiationType: CreateNotificationType,
    url: string,
  ) {
    users.forEach((u) => {
      notificationService.createNotification({
        message: `meeting is ${chatType.status.toLowerCase()}`,
        recipientId: u.userId,
        title: "Meeting status",
        type: notficiationType,
        actionUrl: url,
      } as CreateNotificationInput);
    });
  }
  async createMeeting(
    userId: string,
    schedule: Date,
    title: string,
    workSaceId: string,
    description?: string,
    meetingUrl?: string,
    projectId?: string,
  ) {
    const workSpace = await workSpaceService.getWorkSpaceById(workSaceId);
    if (!workSpace) throw new NoteFoundError("thier is no work space");
    const member = await workSpaceService.getMemberShip(workSaceId, userId);
    if (!member)
      throw new UnauthorizedError("you are not member of this workspace");
    if (projectId) {
      const project = await projectService.getProject(projectId, userId);
      if (!project) throw new NoteFoundError(" their is no project");
      if (workSpace.id !== project?.workspaceId)
        throw new UnauthorizedError(
          "this project is not belong to this workspace",
        );
      const member = await projectService.getMember(userId, projectId);
      if (!member)
        throw new UnauthorizedError("you are not the member of this project");
      if (member.role == "MEMBER")
        throw new UnauthorizedError("you are not authorized to create meeting");
    }

    const meeting = await meetingRepository.create({
      organizerId: userId,
      scheduledAt: schedule,
      title: title,
      workSpaceId: workSaceId,
      description: description,
      meetingUrl: meetingUrl,
      projectId: projectId,
    } as CreateMeetingInput);
    activityService.createActivity({
      action: "CREATE",
      targetId: meeting.id,
      targetType: "MEETING",
      actorId: userId,
      metadata: {
        message: "meeting is created",
      },
    } as CreateActivityInput);

    notificationService.createNotification({
      message: " you are create notfication successfully",
      recipientId: userId,
      title: " meeting created",
      type: "MEETING_STARTED",
    } as CreateNotificationInput);

    return meeting;
  }
  async updateMeeting(
    userId: string,
    meetingId: any,
    meetingUrl?: string,
    projectId?: string,
    description?: string,
    title?: string,
    scheduledAt?: Date,
  ) {
    const meeting = await meetingRepository.findById(meetingId);
    if (meeting?.organizerId != userId)
      throw new UnauthorizedError(
        " you are not eligible to change this meeting data",
      );

    const res = await meetingRepository.update(meetingId, {
      projectId: projectId,
      description: description,
      meetingUrl: meetingUrl,
      title: title,
      scheduledAt: scheduledAt,
    } as UpdateMeetingInput);
    return res;
  }
  async getMeeting(meetingId: any, userId: string) {
    const meeting = await meetingRepository.findById(meetingId);
    const member = await meetingParticipantRepository.findByMeeting(meetingId);
    if (
      !member.some((m) => m.userId == userId) ||
      meeting?.organizerId != userId
    )
      throw new ForbiddenError(" you are not the member of this meeting");
    return meeting;
  }
  // this listMeeting function is done later
  async listMeeting() {}
  async cancelMeeting(meetingId: any, userId: any) {
    const meeting = await meetingRepository.findById(meetingId);
    if (meeting?.organizerId !== userId)
      throw new UnauthorizedError(
        " you are not authorized to cancel this meeting",
      );
    const res = await meetingRepository.updateStatus(meetingId, {
      status: "CANCELLED",
    } as ChangeMeetingStatusInput);
    const particpiant = await meetingParticipantRepository.findByMeeting(
      res.id,
    );
    activityService.createActivity({
      action: "CANCEL",
      targetId: res.id,
      targetType: "MEETING",
      actorId: userId,
    });
    this.createBulkNotficiation(
      particpiant,
      { status: "CANCELLED" },
      "MEETING_CANCELD",
      res.meetingUrl || "",
    );
    return res;
  }
  async startMeeting(meetingId: any, userId: any) {
    const meeting = await meetingRepository.findById(meetingId);
    if (meeting?.organizerId !== userId)
      throw new UnauthorizedError(
        " you are not authorized to start this meeting",
      );
    const res = await meetingRepository.updateStatus(meetingId, {
      status: "LIVE",
    } as ChangeMeetingStatusInput);
    const participant = await meetingParticipantRepository.findByMeeting(
      res.id,
    );
    this.createBulkNotficiation(
      participant,
      { status: "LIVE" },
      "MEETING_STARTED",
      meeting?.meetingUrl || "",
    );
    return res;
  }
  async endMeeting(meetingId: any, userId: any) {
    const meeting = await meetingRepository.findById(meetingId);
    if (!meeting) throw new NoteFoundError(" their is no meeting");
    if (meeting?.organizerId !== userId)
      throw new UnauthorizedError(
        " you are not authorized to end this meeting",
      );
    const res = await meetingRepository.updateStatus(meetingId, {
      status: "COMPLETED",
    } as ChangeMeetingStatusInput);
    const members = await meetingParticipantRepository.findByMeeting(
      meeting.id,
    );
    this.createBulkNotficiation(
      members,
      { status: "COMPLETED" },
      "MEETING_ENDED",
      meeting.meetingUrl || "",
    );
    return res;
  }

  /**  MEETING PARTICIPANT RELATED CODE   */
  async addParticipant(meetingId: string, userId: string, ownerId: any) {
    const user = await userService.getUser({ id: userId });
    if (!user)
      throw new NoteFoundError(" the user of this id is no longer exist");
    const meeting = await meetingRepository.findById(meetingId);
    if (!meeting) throw new NoteFoundError("the meeting is note found");
    if (meeting.organizerId !== ownerId)
      throw new UnauthorizedError(" you are not authorized to do this ");
    const workSpaceMember = await workSpaceService.getAllWorkSpaceMember(
      meeting.workSpaceId,
    );
    if (!workSpaceMember.some((m) => m.userId == userId))
      throw new ForbiddenError("the user should be the member of work space");
    const participant = await meetingParticipantRepository.create({
      meetingId: meetingId,
      userId: userId,
    });
    activityService.createActivity({
      action: "INVITE",
      targetId: participant.id,
      targetType: "MEETING",
      actorId: ownerId,
      metadata: {
        message: "user is add to meeting",
        meetingId: participant.meetingId,
      },
    });
    notificationService.createNotification({
      message: "you are invited for this meeting",
      recipientId: userId,
      title: "Meeting Invitation",
      type: "MEETING_INVITED",
      actionUrl: meeting.meetingUrl || "",
    });
  }
}

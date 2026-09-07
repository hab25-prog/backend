import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { ActivityService } from "../activity/activity.service.js";
import { NotificationService } from "../Notification/notification.service.js";
import { UserService } from "../user/user.service.js";
import { WorkSpaceService } from "../work_space/workSpace.service.js";
import { MeetingParticipantRepository } from "./meeting-participant.repository.js";
import { MeetingService } from "./meeting.service.js";

const meetingParticipantRepository = new MeetingParticipantRepository();
const meetingService = new MeetingService();
const userService = new UserService();
const workSpaceService = new WorkSpaceService();
const activityService = new ActivityService();
const notificationService = new NotificationService();
export class MeetingParticipantService {
  
  async getMeetingParticipants(meetingId: string, userId: any) {
    const meeting = await meetingService.getMeeting(meetingId, userId);
    
    const data = await meetingParticipantRepository.findByMeeting(meetingId);
  }
}

import type { MeetingParticipant } from "../../../generated/prisma/browser.js";
import { MeetingStatus } from "../../../generated/prisma/enums.js";
export interface CreateMeetingInput {
  title: string;
  description?: string;
  scheduledAt: Date;
  workSpaceId: string;
  projectId?: string;
  organizerId: string;
  meetingUrl?: string;
}
export interface UpdateMeetingInput {
  title?: string;
  description?: string;
  scheduledAt?: Date;
  projectId?: string;
  meetingUrl?: string;
}
export interface ChangeMeetingStatusInput {
  status: MeetingStatus;
}
export interface AddMeetingParticipantInput {
  meetingId: string;
  userId: string;
}
export type GetMeetingParticipant = MeetingParticipant[];

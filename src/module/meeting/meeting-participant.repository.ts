import { prisma } from "../../config/prisma.js";
import type { AddMeetingParticipantInput } from "./meeting.types.js";

export class MeetingParticipantRepository {
  async create(data: AddMeetingParticipantInput) {
    return await prisma.meetingParticipant.create({
      data: data,
    });
  }
  async findById(id: string) {
    return await prisma.meetingParticipant.findUnique({
      where: {
        id: id,
      },
    });
  }
  async findByMeeting(meetingId: string) {
    return await prisma.meetingParticipant.findMany({
      where: {
        meetingId: meetingId,
      },
    });
  }
  async findByMeetingAndUser(meetingId: string, userId: string) {
    return await prisma.meetingParticipant.findUnique({
      where: {
        meetingId_userId: {
          meetingId: meetingId,
          userId: userId,
        },
      },
    });
  }
  async delete(id: string) {
    return await prisma.meetingParticipant.delete({
      where: {
        id,
      },
    });
  }
}

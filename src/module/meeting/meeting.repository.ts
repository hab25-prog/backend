import { prisma } from "../../config/prisma.js";
import type {
  ChangeMeetingStatusInput,
  CreateMeetingInput,
  UpdateMeetingInput,
} from "./meeting.types.js";

export class MeetingRepository {
  async create(data: CreateMeetingInput) {
    return await prisma.$transaction(async (tx) => {
      const meeting = await tx.meeting.create({
        data: data,
      });
      const parti = await tx.meetingParticipant.create({
        data: {
          meetingId: meeting.id,
          userId: meeting.organizerId,
        },
      });
      return meeting;
    });
  }
  async findById(id: string) {
    return prisma.meeting.findUnique({
      where: {
        id: id,
      },
    });
  }
  async findByWorkSpace(workSpaceId: string) {
    return await prisma.meeting.findMany({
      where: {
        workSpaceId: workSpaceId,
      },
    });
  }

  async findByProject(projectId: string) {
    return await prisma.meeting.findMany({
      where: {
        projectId: projectId,
      },
    });
  }
  async findByOrganizer(organizerId: string) {
    return await prisma.meeting.findMany({
      where: {
        organizerId: organizerId,
      },
    });
  }
  async update(id: string, data: UpdateMeetingInput) {
    return await prisma.meeting.update({
      where: {
        id,
      },
      data: data,
    });
  }
  async updateStatus(meetingId: string, data: ChangeMeetingStatusInput) {
    return await prisma.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        status: "CANCELLED",
      },
    });
  }
  async delete(meetingId: string) {
    return await prisma.$transaction(async (tx) => {
      const participant = await tx.meetingParticipant.deleteMany({
        where: {
          meetingId: meetingId,
        },
      });
      return await tx.meeting.delete({
        where: {
          id: meetingId,
        },
      });
    });
  }
}

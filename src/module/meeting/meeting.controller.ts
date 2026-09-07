import { response, type Response } from "express";
import { MeetingService } from "./meeting.service.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

const meetingService = new MeetingService();
export const createMeeting = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { schedule, title, workSaceId, description, meetingUrl, projectId } =
    req.body;
  const userId = req.user?.id || "";
  const meeting = await meetingService.createMeeting(
    userId,
    schedule,
    title,
    workSaceId,
    description,
    meetingUrl,
    projectId,
  );
  res.status(200).json({ status: true, data: meeting });
};
export const updateMeeting = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { meetingId } = req.params;
  const { meetingUrl, projectId, description, title, scheduledAt } = req.body;
  const userId = req.user?.id || "";
  const meeting = await meetingService.updateMeeting(
    userId,
    meetingId,
    meetingUrl,
    projectId,
    description,
    title,
    scheduledAt,
  );
  res.status(200).json({ status: true, data: meeting });
};
export const getMeeting = async (req: AuthenticatedRequest, res: Response) => {
  const { meetingId } = req.params;
  const userId = req.user?.id || "";
  const meeting = await meetingService.getMeeting(meetingId, userId);
  res.status(200).json({ status: true, data: meeting });
};
export const startMeeting = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { meetingId } = req.params;
  const userId = req.user?.id || "";
  const meeting = await meetingService.startMeeting(meetingId, userId);
  res.status(200).json({ status: true, data: meeting });
};
export const endMeeting = async (req: AuthenticatedRequest, res: Response) => {
  const { meetingId } = req.params;
  const userId = req.user?.id || "";
  const meeting = await meetingService.endMeeting(meetingId, userId);
  res.status(200).json({ status: true, data: meeting });
};
export const cancelMeeting = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { meetingId } = req.params;
  const userId = req.user?.id || "";
  const meeting = await meetingService.cancelMeeting(meetingId, userId);
  res.status(200).json({ status: true, data: meeting });
};
export const addMember = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const { meetingId, userId } = req.body;
  const data = await meetingService.addParticipant(meetingId, userId, id);
  res.status(201).json({ status: true, data: data });
};

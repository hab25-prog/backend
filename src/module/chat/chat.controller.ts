import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ChatService } from "./chat.service.js";

const chatService = new ChatService();
/* 1, CONVERSTAION RELATED CONTROLLLER  */
export const createConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const data = await chatService.createConversation(userId);
  res.status(201).json({ status: true, data: data });
};
export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const conversationId = req.params.conversationId;
  const userId = req.user?.id;
  const data = await chatService.getConversation(userId, conversationId);
  res.status(201).json({ status: true, data: data });
};
export const myConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const datas = await chatService.getConversationByUserId(userId);
  res.status(201).json({ status: true, data: datas });
};
export const updateConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const conversationId = req.params.conversationId;
  const { name } = req.body;
  const data = await chatService.updateConversation(
    userId,
    conversationId,
    name,
  );
  res.status(201).json({ status: true, data: data });
};
export const deleteConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const conversationId = req.params.conversationId;
  const data = await chatService.deleteConversation(userId, conversationId);
  res.status(201).json({ status: true, data: data });
};
/* 2, CONVERSATION-MEMBER RELATED CONTROLLER */
export const addMember = async (req: AuthenticatedRequest, res: Response) => {
  const memberId = req.params.memberId;
  const userId = req.user?.id;
  const { conversationId } = req.body;
  const data = await chatService.addMember(userId, memberId, conversationId);
  res.status(201).json({ status: true, data: data });
};
export const getMembers = async (req: AuthenticatedRequest, res: Response) => {
  const conversationId = req.params.conversationId;
  const userId = req.user?.id;
  const data = await chatService.getMembersByConversationId(
    conversationId,
    userId,
  );
  res.status(201).json({ status: true, data: data });
};
export const removeMember = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const memberShipId = req.params.memberShipId;
  const userId = req.user?.id;
  const data = await chatService.removeMember(userId, memberShipId);
  res
    .status(200)
    .json({ status: true, message: "user sucessfully removed from chat" });
};
/* 3, CONVERSATION MESSAGE RELATED CONTROLLER  */

export const writeMessage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { message, conversationId } = req.body;
  const userId = req.user?.id;
  const data = await chatService.sendMessage(message, userId, conversationId);
  res.status(201).json({ status: true, message: "sent" });
};
export const getMessage = async (req: AuthenticatedRequest, res: Response) => {
  const messageId = req.params.messageId;
  const userId = req.user?.id;
  const data = await chatService.getMessage(userId, messageId);
  res.status(201).json({ status: true, data: data });
};
export const getMessagesByConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const conversationId = req.params.conversationId;
  const userId = req.user?.id;
  const data = await chatService.getMessageByConversation(
    userId,
    conversationId,
  );
  res.status(200).json({ status: true, data: data });
};
export const updateMessage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const messageId = req.params.messageId;
  const { message } = req.body;
  const userId = req.user?.id;
  const data = await chatService.updateMessage(userId, message, messageId);
  res.status(201).json({ status: true, data: data });
};
export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const messageId = req.params.messageId;
  const data = await chatService.deleteMessage(userId, messageId);
  res.status(201).json({ status: true, data: data });
};

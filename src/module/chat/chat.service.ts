import type { NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { UserService } from "../user/user.service.js";
import { ChatRepository } from "./chat.repository.js";
import { ForbiddenError } from "../../shared/errors/ForbiddenError.js";

const chatRepository = new ChatRepository();
const userService = new UserService();
export class ChatService {
  /* 1, CONVERSATION SERVICE METHODS  */
  async createConversation(userId: any) {
    // console.log("the user id is", userId);
    // // const user = await userService.getUser(userId);
    // console.log("the user is", user);
    // if (!user) throw new UnauthorizedError(" the user is not found");
    const conversation = await chatRepository.createConversation({
      createdById: userId,
      type: "DIRECT",
    });
    return conversation;
  }
  async getConversation(userId: any, conversationId: any) {
    const members = await chatRepository.getConversationMember(
      userId,
      conversationId,
    );
    if (!members)
      throw new ForbiddenError(" you are not the member of this chat");
    const conversation =
      await chatRepository.getConversationById(conversationId);
    return conversation;
  }
  async getConversationByUserId(userId: any) {
    const conversations = await chatRepository.getConversationByUserId(userId);
    return conversations;
  }

  async updateConversation(userId: any, conversationId: any, name: string) {
    const conv = await chatRepository.getConversationById(conversationId);
    if (!conv) throw new NoteFoundError("their is no conversation");
    if (conv.createdById !== userId)
      throw new ForbiddenError(" you have no permission to do this");
    const conversation = await chatRepository.updateConversation(
      conversationId,
      { name: name },
    );
  }
  async deleteConversation(userId: any, conversationId: any) {
    const conversation =
      await chatRepository.getConversationById(conversationId);
    if (conversation?.createdById !== userId)
      throw new ForbiddenError(
        " you are not authorized to delete this conversation",
      );
    const data = await chatRepository.deleteConversation(conversationId);
    return data;
  }
  /*2. MESSAGE SERVICE METHODS  */
  async sendMessage(content: string, userId: any, conversationId: string) {
    const member = await chatRepository.getConversationMember(
      userId,
      conversationId,
    );
    if (!member)
      throw new ForbiddenError(" you are not the member of this conversation");
    // their must be content validation
    const message = await chatRepository.createMessage({
      content: content,
      conversationId: conversationId,
      senderId: userId,
    });
    return message;
  }
  async getMessage(userId: any, messageId: any) {
    const message = await chatRepository.getMessageById(messageId);
    if (!message) throw new NoteFoundError("message is not found");
    const conversationMember = await chatRepository.getConversationMembers(
      message?.conversationId,
    );
    if (!conversationMember.some((m) => m.userId == userId))
      throw new UnauthorizedError("you are not eligible to see this");
    return message;
  }
  async getMessageByConversation(userId: any, conersationId: any) {
    const member = await chatRepository.getConversationMember(
      userId,
      conersationId,
    );
    if (!member)
      throw new ForbiddenError("you are not the member of this conversation");
    const messages =
      await chatRepository.getessageByConversation(conersationId);
    return messages;
  }
  async updateMessage(userId: any, content: string, messageId: any) {
    const message = await chatRepository.getMessageById(messageId);
    if (message?.senderId !== userId)
      throw new ForbiddenError(
        " you are not perimmted to edit this chat message",
      );
    const data = await chatRepository.updateMessage(messageId, content);
    return data;
  }
  async deleteMessage(userId: any, messageId: any) {
    const message = await chatRepository.getMessageById(messageId);
    if (message?.senderId !== userId)
      throw new ForbiddenError("this message is not belong to you");
    const res = await chatRepository.deleteMessage(messageId);
    return res;
  }
  /*3. MEMBER SERVICE METHODS */
  async addMember(userId: any, memberId: any, conversationId: string) {
    const conversation =
      await chatRepository.getConversationById(conversationId);
    if (conversation?.createdById !== userId)
      throw new ForbiddenError(
        "you are not permmision for add new member to this chat",
      );
    const data = await chatRepository.addConversationMember({
      conversationId: conversationId,
      userId: memberId,
    });
  }
  async getMembersByConversationId(conversationId: any, userId: any) {
    const conversation =
      await chatRepository.getConversationById(conversationId);
    const member = await chatRepository.getConversationMember(
      userId,
      conversationId,
    );
    console.log("the member is", member);
    if (!member)
      throw new ForbiddenError(" you are not the member of this conversation");
    const members = await chatRepository.getConversationMembers(conversationId);
    return members;
  }
  async removeMember(userId: any, id: any) {
    const member = await chatRepository.getMembersById(id);
    if (!member) throw new NoteFoundError("their is no this type of member");
    const conversation = await chatRepository.getConversationById(
      member?.conversationId,
    );
    if (conversation?.createdById !== userId)
      throw new ForbiddenError("you are not authorized to remove member");
    const data = await chatRepository.removeConversationMember(id);
    return data;
  }

  async assertMember(conversationId: string, userId: string) {
    const member = await chatRepository.getMember(conversationId, userId);

    if (!member) {
      throw new AppError("You are not a member of this conversation", 403);
    }
  }
}

import { prisma } from "../../config/prisma.js";
import type {
  AddConversationMemberInput,
  CreateConversationInput,
  CreateMessageInput,
  UpdateConversationInput,
} from "./chat.types.js";

export class ChatRepository {
  /* 1, CONVERSATION REPOSITORY METHODS  */
  async createConversation(data: CreateConversationInput) {
    return await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: data,
      });
      const particpant = await tx.conversationMembers.create({
        data: {
          conversationId: conversation.id,
          userId: conversation.createdById,
        },
      });
      return conversation;
    });
  }
  async getConversationById(id: any) {
    return await prisma.conversation.findUnique({
      where: {
        id: id,
      },
      include: {
        participants: true,
      },
    });
  }
  async getConversationByUserId(userId: string) {
    return await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }
  async updateConversation(id: string, data: UpdateConversationInput) {
    return await prisma.conversation.update({
      where: {
        id,
      },
      data: data,
    });
  }
  async deleteConversation(id: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({
        where: {
          conversationId: id,
        },
      });
      await tx.conversationMembers.deleteMany({
        where: {
          conversationId: id,
        },
      });
      return await tx.conversation.delete({
        where: {
          id: id,
        },
      });
    });
  }
  /* 2, MESSAGE REPOSITORY METHODS  */
  async createMessage(data: CreateMessageInput) {
    return await prisma.message.create({
      data: data,
    });
  }
  async getMessageById(id: string) {
    return await prisma.message.findUnique({
      where: {
        id: id,
      },
    });
  }
  async getessageByConversation(conversationId: string) {
    return await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: {
          select:{
            id: true,
            username: true
          }
        }
      },
    });
  }
  async updateMessage(id: string, content: string) {
    return await prisma.message.update({
      where: {
        id,
      },
      data: {
        content: content,
      },
    });
  }
  async deleteMessage(id: string) {
    return await prisma.message.delete({
      where: {
        id,
      },
    });
  }
  /* 3, CONVERSATION MEMBERS REPOSITORY METHODS  */
  async addConversationMember(data: AddConversationMemberInput) {
    return await prisma.conversationMembers.create({
      data: data,
    });
  }
  async getMembersById(id: string) {
    return await prisma.conversationMembers.findUnique({
      where: {
        id: id,
      },
    });
  }
  async getConversationMembers(conversationId: string) {
    return await prisma.conversationMembers.findMany({
      where: {
        conversationId: conversationId,
      },
    });
  }
  async getConversationMemberById(id: string) {
    return await prisma.conversationMembers.findUnique({
      where: {
        id: id,
      },
    });
  }
  async getConversationMember(userId: any, conversationId: string) {
    console.log("user id", userId, "conversation id", conversationId);
    return await prisma.conversationMembers.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId: userId,
        },
      },
    });
  }
  async removeConversationMember(id: any) {
    return await prisma.conversationMembers.delete({
      where: {
        id: id,
      },
    });
  }
  async getMember(userId: string, conversationId: string) {
    return await prisma.conversationMembers.findMany({
      where: {
        userId: userId,
        conversationId: conversationId,
      },
    });
  }
}

import type {
  ConversationType,
  ConversationMembers,
} from "../../../generated/prisma/client.js";

/**
 * Create a new conversation
 */
export type CreateConversationInput = {
  name?: string;
  type: ConversationType;
  createdById: string;
};

/**
 * Update conversation
 */
export type UpdateConversationInput = {
  name?: string;
};

/**
 * Add a user to a conversation
 */
export type AddConversationMemberInput = {
  conversationId: string;
  userId: string;
};

/**
 * Create a message
 */
export type CreateMessageInput = {
  conversationId: string;
  senderId: string;
  content: string;
};

/**
 * Update a message
 */
export type UpdateMessageInput = {
  content: string;
};

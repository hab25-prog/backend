export type JoinConversationEvent = {
  type: "JOIN_CONVERSATION";
  conversationId: string;
};

export type LeaveConversationEvent = {
  type: "LEAVE_CONVERSATION";
  conversationId: string;
};

export type ChatClientEvent = JoinConversationEvent | LeaveConversationEvent;

import { ChatService } from "../module/chat/chat.service.js";
import { NoteFoundError } from "../shared/errors/NotFoundError.js";
import { conversationManager } from "./conversation.manager.js";
import { authenticateWebSocket } from "./websocket.auth.js";
import type { AuthenticatedSocket } from "./websocket.types.js";
const conversationService = new ChatService();
export async function handleJoinConversation(
  client: AuthenticatedSocket,
  conversationId: string,
) {
  if (!client.userId) {
    return;
  }

  try {
    await conversationService.assertMember(conversationId, client.userId);

    conversationManager.join(conversationId, client);

    client.send(
      JSON.stringify({
        type: "JOIN_CONVERSATION_SUCCESS",

        conversationId,
      }),
    );
  } catch (error) {
    client.send(
      JSON.stringify({
        type: "ERROR",
        code: "CONVERSATION_ACCESS_DENIED",
        message: "You cannot join this conversation",
      }),
    );
  }
}
export async function handleLeaveConversation(
  client: AuthenticatedSocket,
  conversationId: string,
) {
  if (!client.userId) {
    return;
  }
  conversationManager.leave(conversationId, client);
  client.send(
    JSON.stringify({
      type: "LEAVE_CONVERSATION_SUCCESS",
      conversationId,
    }),
  );
}
export async function handleSendMessage(
  client: AuthenticatedSocket,
  conversationId: string,
  content: string,
) {
  // 1. Check membership
  if (!client.userId) return;
  try {
    await conversationService.assertMember(conversationId, client.userId);
    // 2. Save message
    const message = await conversationService.sendMessage(
      content,
      client.userId,
      conversationId,
    );
    if (!message) throw new NoteFoundError("message is not sent");
    // 3. Broadcast created message
    const conversation = conversationManager.getSockets(conversationId);
    conversation.forEach((c) => {
      c.send(
        JSON.stringify({
          message: message.content,
        }),
      );
    });
  } catch (error) {
    client.send(
      JSON.stringify({
        type: "ERROR",
        code: "CONVERSATION_ACCESS_DENIED",
        message: "You cannot join this conversation",
      }),
    );
  }
}

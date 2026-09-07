import {
  handleJoinConversation,
  handleLeaveConversation,
} from "../../../websocket/chat.handdler.js";
import type { AuthenticatedSocket } from "../../../websocket/websocket.types.js";

export async function dispatchEvent(
  client: AuthenticatedSocket,
  event: unknown,
) {
  if (typeof event !== "object" || event === null || !("type" in event)) {
    return;
  }

  const data = event as {
    type: string;
  };
  switch (data.type) {
    case "JOIN_CONVERSATION": {
      const joinConversationEvent = event as {
        type: "JOIN_CONVERSATION";
        conversationId: string;
      };
      await handleJoinConversation(
        client,
        joinConversationEvent.conversationId,
      );
      break;
    }

    case "LEAVE_CONVERSATION": {
      const leaveConversationEvent = event as {
        type: "LEAVE_CONVERSATION";
        conversationId: string;
      };

      await handleLeaveConversation(
        client,
        leaveConversationEvent.conversationId,
      );

      break;
    }
    default:
      client.send(
        JSON.stringify({
          type: "ERROR",
          code: "UNKNOWN_EVENT",
          message: "Unknown WebSocket event",
        }),
      );
  }
}

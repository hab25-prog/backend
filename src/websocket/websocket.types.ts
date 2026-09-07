import type { WebSocket } from "ws";
import { z } from "zod";

export interface AuthenticatedSocket extends WebSocket {
  userId: string;
  userName: string;
}
export type JoinConversationEvent = {
  type: "JOIN_CONVERSATION";
  conversationId: string;
};

export const joinConversationEventSchema = z.object({
  type: z.literal("JOIN_CONVERSATION"),
  conversationId: z.string().uuid(),
});

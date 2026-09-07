import type { AuthenticatedSocket } from "./websocket.types.js";

export class ConversationManager {
  private conversations = new Map<string, Set<AuthenticatedSocket>>();
  join(conversationId: string, socket: AuthenticatedSocket): void {
    let sockets = this.conversations.get(conversationId);

    if (!sockets) {
      sockets = new Set<AuthenticatedSocket>();

      this.conversations.set(conversationId, sockets);
    }

    sockets.add(socket);
  }
  getSockets(conversationId: string): Set<AuthenticatedSocket> {
    return this.conversations.get(conversationId) ?? new Set();
  }
  broadcast(conversationId: string, message: string): void {
    const sockets = this.conversations.get(conversationId);

    if (!sockets) {
      return;
    }

    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) {
        socket.send(message);
      }
    }
  }
  leave(conversationId: string, socket: AuthenticatedSocket): void {
    const sockets = this.conversations.get(conversationId);

    if (!sockets) {
      return;
    }

    sockets.delete(socket);

    if (sockets.size === 0) {
      this.conversations.delete(conversationId);
    }
  }
  removeSocket(socket: AuthenticatedSocket): void {
    for (const [conversationId, sockets] of this.conversations) {
      sockets.delete(socket);

      if (sockets.size === 0) {
        this.conversations.delete(conversationId);
      }
    }
  }
}
export const conversationManager = new ConversationManager();

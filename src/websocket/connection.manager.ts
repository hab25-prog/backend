import type { AuthenticatedSocket } from "./websocket.types.js";

export class ConnectionManager {
  private connections = new Map<string, AuthenticatedSocket>();
  set(userId: string, socket: AuthenticatedSocket) {
    this.connections.set(userId, socket);
  }
  get(userId: string) {
    return this.connections.get(userId);
  }
  remove(userId: string) {
    this.connections.delete(userId);
  }
}
export const connectionManager = new ConnectionManager();

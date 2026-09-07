import { WebSocketServer } from "ws";
import type { AuthenticatedSocket } from "./websocket.types.js";
import { connectionManager } from "./connection.manager.js";
import { conversationManager } from "./conversation.manager.js";
import { dispatchEvent } from "../module/chat/webSocket/chat.dispatcher.js";
import { json } from "node:stream/consumers";

export const wss = new WebSocketServer({
  noServer: true,
});
wss.on("connection", (ws, equest) => {
  const client = ws as AuthenticatedSocket;

  console.log(" connection is started ");
  if (!client.userId) {
    client.close();
    return;
  }
  connectionManager.set(client.userId, client);
  console.log(`User ${client.userId} connected`);
  client.on("message", async (message) => {
    try {
      console.log("message from client", message.toString());
      const data = JSON.parse(message.toString());
      await dispatchEvent(client, data);
    } catch (error) {
      console.log("web socket message error", error);
      client.send(
        JSON.stringify({
          type: "ERROR",
          code: "INVALID_MESSAGE",
          message: "Invalid WebSocket message",
        }),
      );
    }
  });
  client.on("close", () => {
    connectionManager.remove(client.userId!);

    conversationManager.removeSocket(client);

    console.log(`User ${client.userId} disconnected`);
    console.log("connection is closed");
  });
});

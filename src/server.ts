import app from "./app.js";
import { env } from "./config/env.js";
import { createServer } from "node:http";
import { wss } from "./websocket/websocket.server.js";
import { authenticateWebSocket } from "./websocket/websocket.auth.js";
import type { AuthenticatedSocket } from "./websocket/websocket.types.js";
// import { Client } from "pg";

const server = createServer(app);
server.on("upgrade", async (request, socket, head) => {
  const auth = await authenticateWebSocket(request);
  if (!auth || !auth.userId || !auth.userName) {
    console.log("you must login first");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    const cleint = ws as AuthenticatedSocket;
    cleint.userId = auth.userId;
    cleint.userName = auth.userName;
    wss.emit("connection", cleint, request);
  });
});

server.listen(env.PORT, () => {
  console.log(`Server running on port http://localhost:${env.PORT}`);
});

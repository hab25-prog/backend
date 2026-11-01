const WebSocket = require("ws");

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0MjE1MDc1LWFkMGQtNDYzMy1hZWE2LTU1NGYwMDAxNmFjYSIsInVzZXJOYW1lIjoiaHViMjEyOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkxMzU3MjI3LCJleHAiOjE3OTE0NDM2Mjd9.h_vxzcMQpxgJR7U3Djv9l5a3Zv1fzSqUexAhOWj_cBY";

const conversationId = "YOUR_CONVERSATION_ID";

const ws = new WebSocket("ws://localhost:5000", {
  headers: {
    Cookie: `jwt=${jwt}`,
  },
});

ws.on("open", () => {
  console.log("✅ WebSocket connected");

  // Test JOIN_CONVERSATION
  ws.send(
    JSON.stringify({
      type: "JOIN_CONVERSATION",
      conversationId,
    }),
  );

  console.log("📤 JOIN_CONVERSATION sent");
});

ws.on("message", (data) => {
  console.log("📩 Server:", data.toString());
});
// ws.send("hi it is my second message");

ws.on("close", () => {
  console.log("❌ WebSocket closed");
});

ws.on("error", (error) => {
  console.log("⚠️ WebSocket error:", error.message);
});

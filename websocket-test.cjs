const WebSocket = require("ws");

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0MjE1MDc1LWFkMGQtNDYzMy1hZWE2LTU1NGYwMDAxNmFjYSIsInVzZXJOYW1lIjoiaHViMjEyOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzg4NzIxNDU5LCJleHAiOjE3ODg4MDc4NTl9.sHHke2hOYb-D_PQXEzthfj-EQw64d6HoMBAkVSU4HHc";

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

ws.on("close", () => {
  console.log("❌ WebSocket closed");
});

ws.on("error", (error) => {
  console.log("⚠️ WebSocket error:", error.message);
});

const WebSocket = require("ws");

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0MjE1MDc1LWFkMGQtNDYzMy1hZWE2LTU1NGYwMDAxNmFjYSIsInVzZXJOYW1lIjoiaHViMjEyOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzg4NjI3MTM0LCJleHAiOjE3ODg3MTM1MzR9.7yn-4ZxVRpn5oPEN5G3LF7qeI0UQdcFcEO5gQsOkkLM";

const ws = new WebSocket("ws://localhost:5000", {
  headers: {
    Cookie: `jwt=${jwt}`,
  },
});

ws.on("open", () => {
  console.log("✅ WebSocket connected");
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

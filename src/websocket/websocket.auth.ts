import { parseCookie } from "cookie";
import type { IncomingMessage } from "node:http";
import {
  verfiyToken,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import type { promises } from "node:timers";
import { type AuthTokenPayload } from "../middleware/auth.middleware.js";
import type { AuthenticatedSocket } from "./websocket.types.js";

export async function authenticateWebSocket(request: IncomingMessage) {
  const cookieHeader = request.headers.cookie;

  const cookies = parseCookie(cookieHeader ?? "");

  const token = cookies.jwt || "";

  const userData = verfiyToken(token);
  if (!userData) return null;
  // const userId = userData.user?.id;
  return {
    userId: userData.id || null,
    userName: userData.userName || null,
  } as AuthenticatedSocket;
}

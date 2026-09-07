import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError.js";

interface JwtPayload {
  id: string;
  role: string;
  userName: string;
}
export type AuthTokenPayload = {
  id: string;
  role: string;
  userName: string;
};
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function generateAuthCookie(
  userPayload: {
    id: string;
    role: string;
    userName: string;
  },
  res: Response,
) {
  const token = Jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: "1d" });
  res.cookie("jwt", token, {
    httpOnly: true, // Blocks JavaScript access (XSS Protection)
    sameSite: "strict", // Blocks cross-site requests (CSRF Protection)
    // sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // Explicit expiration matching the JWT (1 day in ms)
    path: "/", // Ensures the cookie is accessible across all routes of your API
  });
  console.log("the token is :", token);
  if (token) return token;
  return null;
}
export async function isLogin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.jwt;
    const data = (await Jwt.verify(token, env.JWT_SECRET)) as JwtPayload;
    if (!data) {
      throw new UnauthorizedError("before this please logged in");
    }
    req.user = data;
    next();
  } catch (error) {
    throw new UnauthorizedError("befor you must logged in");
  }
}
export function verfiyToken(token: string): AuthTokenPayload | null {
  try {
    const data = Jwt.verify(token, env.JWT_SECRET);

    if (typeof data === "string") {
      return null;
    }

    return data as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}

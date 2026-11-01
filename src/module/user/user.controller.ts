import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import Jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import bcryp from "bcrypt";
import { jwt } from "zod";
import { generateAuthCookie } from "../../middleware/auth.middleware.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await userService.register(data);
  generateAuthCookie(
    {
      id: user.id,
      role: user.role,
      userName: user.username,
    },
    res,
  );

  res.status(201).json({
    status: "sucess",
    message: "you are registerd successfully",
  });
};
export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  const user = await userService.loginUser(userName, password);

  const token = generateAuthCookie(
    {
      id: user.id,
      userName: user.username,
      role: user.role,
    },
    res,
  );
  if (!token)
    return res
      .status(500)
      .json({ status: "error", message: "enternal server error" });
  res.status(200).json({
    status: "sucess",
    message: "you successfully lgged in",
    data: user,
  });
};

export const fetchMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("befor you must looegd in");
  }
  const id = req.user?.id;
  const user = await userService.getUser({ id: id });
  if (!user) return;
  res.status(200).json({
    status: true,
    data: {
      userId: user.id,
      userName: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
};
export const logOut = async (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });
  console.log("the user is logged out");
  res.status(200).json({ status: "ok", message: "sucessfully logout" });
};

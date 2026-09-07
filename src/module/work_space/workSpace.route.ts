import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import {
  addUser,
  createWorkSpace,
  getMembers,
  removeUser,
  updateRole,
} from "./workSpace.controller.js";

const workSpaceRoute = Router();

workSpaceRoute.post("/addWorkSpace", isLogin, asyncHandler(createWorkSpace));
workSpaceRoute.get("/allWorkSpace", isLogin);
workSpaceRoute.get("/getAllUser", isLogin, asyncHandler(getMembers));
workSpaceRoute.patch("/addUser", isLogin, asyncHandler(addUser));
workSpaceRoute.patch("/removeUser", isLogin, asyncHandler(removeUser));
workSpaceRoute.patch("/updateRole", isLogin, asyncHandler(updateRole));

export default workSpaceRoute;

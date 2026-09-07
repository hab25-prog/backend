import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import {
  addNewMeber,
  deleteProject,
  getAllMember,
  getProjectById,
  newProject,
  removeMember,
  updateRole,
} from "./project.controller.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";

const projectRoter = Router();

projectRoter.post("/createNew", isLogin, asyncHandler(newProject));
projectRoter.get("/getProject/:id", isLogin, asyncHandler(getProjectById));
projectRoter.get(
  "/allProjectMember/:projectId",
  isLogin,
  asyncHandler(getAllMember),
);
projectRoter.delete(
  "/deleteProject/:projectId",
  isLogin,
  asyncHandler(deleteProject),
);
projectRoter.delete(
  "/removeMember/:userId",
  isLogin,
  asyncHandler(removeMember),
);
projectRoter.patch("/memberAdd/:projectId", isLogin, asyncHandler(addNewMeber));
projectRoter.patch("/updateRole/:userId", isLogin, asyncHandler(updateRole));

export default projectRoter;

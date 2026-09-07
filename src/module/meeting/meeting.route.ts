import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import {
  createMeeting,
  endMeeting,
  getMeeting,
  startMeeting,
  updateMeeting,
} from "./meeting.controller.js";

const meetingRouter = Router();
meetingRouter.get("/getMeeting/:meetingId", isLogin, asyncHandler(getMeeting));
meetingRouter.post("/createMeeting", isLogin, asyncHandler(createMeeting));

meetingRouter.post(
  "/updateMeeting/:meetingId",
  isLogin,
  asyncHandler(updateMeeting),
);
meetingRouter.post(
  "/startMeeting/:meetingId",
  isLogin,
  asyncHandler(startMeeting),
);
meetingRouter.post("/endMeeting/:meetingId", isLogin, asyncHandler(endMeeting));


export default meetingRouter;

import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";
import {
  addMember,
  createConversation,
  deleteConversation,
  deleteMessage,
  getConversation,
  getMembers,
  getMessage,
  getMessagesByConversation,
  myConversation,
  removeMember,
  updateConversation,
  updateMessage,
  writeMessage,
} from "./chat.controller.js";

const chatRouter = Router();
chatRouter.post(
  "/conversation/create",
  isLogin,
  asyncHandler(createConversation),
);
chatRouter.post("/member/add/:memberId", isLogin, asyncHandler(addMember));
chatRouter.post("/message/sentMessage", isLogin, asyncHandler(writeMessage));
chatRouter.get(
  "/conversation/getAllConversations",
  isLogin,
  asyncHandler(myConversation),
);
chatRouter.get(
  "/conversation/getConversation/:conversationId",
  isLogin,
  asyncHandler(getConversation),
);
chatRouter.get(
  "/message/getAll/:conversationId",
  isLogin,
  asyncHandler(getMessagesByConversation),
);
chatRouter.get(
  "/member/getMembers/:conversationId",
  isLogin,
  asyncHandler(getMembers),
);
chatRouter.get(
  "/message/getMessage/:messageId",
  isLogin,
  asyncHandler(getMessage),
);
chatRouter.patch(
  "/conversation/update/:conversationId",
  isLogin,
  asyncHandler(updateConversation),
);
chatRouter.delete(
  "/conversation/delete/:conversationId",
  isLogin,
  asyncHandler(deleteConversation),
);
chatRouter.patch(
  "/message/update/:messageId",
  isLogin,
  asyncHandler(updateMessage),
);
chatRouter.delete(
  "/member/removeMember/:memberShipId",
  isLogin,
  asyncHandler(removeMember),
);
chatRouter.delete(
  "/message/delete/:messageId",
  isLogin,
  asyncHandler(deleteMessage),
);
export default chatRouter;

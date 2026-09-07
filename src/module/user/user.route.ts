import { Router } from "express";
import { login, registerUser, fetchMe, logOut } from "./user.controller.js";
import { isLogin } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/util/AsyncHandler.js";

const userRoutes = Router();

userRoutes.post("/register", asyncHandler(registerUser));
userRoutes.post("/login", asyncHandler(login));
userRoutes.post("/logOut", logOut);
userRoutes.get("/fetchMe", isLogin, fetchMe);

export default userRoutes;

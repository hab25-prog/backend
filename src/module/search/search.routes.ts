import { Router } from "express";
import { isLogin } from "../../middleware/auth.middleware.js";
import { searchAll } from "./search.controller.js";

const searchRouter = Router();
// Query parameters are not part of an Express route pattern.
// `searchAll` reads the optional `query` value from `req.query`.
searchRouter.get("/allSearch", isLogin, searchAll);
export default searchRouter;

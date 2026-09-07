import express from "express";
import cors from "cors";
import routers from "./routers/index.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routers);
app.use(errorMiddleware);
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

export default app;

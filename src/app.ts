import express from "express";
import cors from "cors";
import passport from "passport";
import { user_router } from "./entities/user/routes";
import { errorHandler } from "./utils/middleware/error";
import { chat_router } from "./entities/chat/routes";
import { message_router } from "./entities/message/routes";

const app = express();

const allowedOrigins = ["*"];
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use("/users", user_router);
app.use("/chats", chat_router);
app.use("/messages", message_router);
app.use(passport.initialize());
app.use(errorHandler);

export default app;

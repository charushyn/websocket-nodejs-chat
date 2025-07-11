import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
import { WebSocketServer } from "ws";

mongoose.connect(process.env.DB_URL || "");

const port = 3000;
const wss = new WebSocketServer({ port: 3001 });

import { verifyTokenAndGetUser } from "./utils/helpers/verifyAndGetUser";
import { MessageModel } from "./entities/message/model";
import { ChatModel } from "./entities/chat/model";

wss.on("connection", async (ws, req) => {
  console.log(1);
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const token = params.get("token");
  const chatId = params.get("chatId");

  if (!token || !chatId) {
    ws.close();
    return;
  }

  let user;
  try {
    user = await verifyTokenAndGetUser(token);
    console.log(user);
  } catch (e) {
    console.log(e);
    ws.close();
    return;
  }

  console.log(`User ${user.id} connected.`);

  ws.on("message", async (data) => {
    const text = data.toString();

    const chat = await ChatModel.findOne({ _id: chatId, users: user.id });
    console.log(chat, 2001);
    if (chat === null) {
      console.log(`User ${user.id} is not in chat ${chatId}`);
      return;
    }

    await MessageModel.create({
      user: user.id,
      chatId: chatId,
      text: text,
    });

    wss.clients.forEach((client) => {
      console.log("haha");
      if (client.readyState === ws.OPEN) {
        client.send(text);
      }
    });
  });

  ws.on("close", () => {
    console.log(`User ${user.id} disconnected.`);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

wss.on("listening", () => {
  console.log("WS SERVER LISTENING ON 8080");
});

export default wss;

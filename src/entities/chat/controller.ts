import "dotenv/config";

import { Request, Response } from "express";
import { sendOkResponse } from "../../responses";
import { ChatType, ChatModel } from "./model";
import { AppError } from "../../utils/types/AppError";

async function getChats(req: Request, res: Response) {
  const chats = await ChatModel.findOne().lean().exec();

  sendOkResponse(res, 200, chats);
}

async function getChatById(req: Request, res: Response) {
  const { chatId } = req.params;

  const chat = await ChatModel.findById(chatId).lean().exec();

  if (chat === null) {
    throw new AppError(`Chat was not founded by ${chatId}`, 404);
  }

  sendOkResponse(res, 200, chat);
}

async function createChat(req: Request, res: Response) {
  const { title } = req.body;

  const chat_body: ChatType = {
    title: title,
  };
}

export { getChats, getChatById };

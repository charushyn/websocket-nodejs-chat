import "dotenv/config";

import { Request, Response } from "express";
import { sendOkResponse } from "../../responses";
import { ChatType, ChatModel } from "./model";
import { AppError } from "../../utils/types/AppError";
import { UserModel } from "../user/model";

async function getChats(req: Request, res: Response) {
  const chats = await ChatModel.find().lean().exec();

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
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }
  const { title } = req.body;
  const { id } = req.user;

  const user_creator = await UserModel.findById(id)
    .lean()
    .select("-password")
    .exec();

  if (user_creator === null) {
    throw new AppError("User whose creating chat is undefined", 404);
  }

  const chat_body: ChatType = {
    title: title,
    users: [user_creator._id],
  };

  const chat = await ChatModel.create(chat_body);

  sendOkResponse(res, 201, chat);
}

async function updateChatTitle(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }
  const { chatId } = req.params;
  const { title } = req.body;
  const { id } = req.user;

  const query = await ChatModel.findById(chatId);

  if (query === null) {
    throw new AppError("Chat is undefined");
  }

  if (!query.users.includes(id)) {
    throw new AppError("You have to be in this chat", 403);
  }

  query.title = title;

  await query.save();

  sendOkResponse(res, 200, query);
}

async function deleteChat(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }
  const { chatId } = req.params;
  const { id } = req.user;

  const query = await ChatModel.findById(chatId);

  if (query === null) {
    throw new AppError("Chat is undefined");
  }

  if (!query.users.includes(id)) {
    throw new AppError("You have to be in this chat", 403);
  }

  await query.deleteOne();

  sendOkResponse(res, 204, null);
}

async function joinToChat(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }

  const { chatId } = req.params;
  const { id } = req.user;

  const query = await ChatModel.findById(chatId);

  if (query === null) {
    throw new AppError("Chat is undefined");
  }

  if (query.users.includes(id)) {
    throw new AppError("You are already in this chat", 409);
  }

  query.users = [...query.users, id];

  await query.save();

  sendOkResponse(res, 200, query);
}

async function leaveFromChat(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }

  const { chatId } = req.params;
  const { id } = req.user;

  const query = await ChatModel.findById(chatId);

  if (query === null) {
    throw new AppError("Chat is undefined");
  }

  if (!query.users.includes(id)) {
    throw new AppError("You are not in this chat", 409);
  }

  const user_index = query.users.findIndex((v) => v === id);

  query.users = query.users.splice(user_index, 1);

  await query.save();

  sendOkResponse(res, 200, query);
}

export {
  getChats,
  getChatById,
  createChat,
  updateChatTitle,
  deleteChat,
  joinToChat,
  leaveFromChat,
};

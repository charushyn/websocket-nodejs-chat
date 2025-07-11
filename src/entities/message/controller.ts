import "dotenv/config";

import { Request, Response } from "express";
import { sendOkResponse } from "../../responses";
import { MessageModel } from "./model";
import { ChatModel } from "../chat/model";
import { AppError } from "../../utils/types/AppError";

async function getMessages(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware error", 100);
  }
  const { chatId } = req.params;
  const { id } = req.user;

  const chat = await ChatModel.findOne({ _id: chatId, users: id });

  if (chat === null) {
    throw new AppError("Chat with this message is undefined", 404);
  }

  const messages = await MessageModel.find()
    .where("chatId")
    .equals(chatId)
    .lean()
    .exec();

  sendOkResponse(res, 200, messages);
}

async function getMessageById(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware error", 100);
  }
  const { chatId, messageId } = req.params;
  const { id } = req.user;

  const chat = await ChatModel.findOne({ _id: chatId, users: id });

  if (chat === null) {
    throw new AppError("Chat with this message is undefined", 404);
  }

  const message = await MessageModel.findById(messageId).lean().exec();

  if (message === null) {
    throw new AppError(`Message was not founded by ${messageId}`, 404);
  }

  sendOkResponse(res, 200, message);
}

async function createMessage(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }
  const { text } = req.body;
  const { id } = req.user;
  const { chatId } = req.params;

  const chat = await ChatModel.findOne({ _id: chatId, users: id })
    .lean()
    .exec();

  if (chat === null) {
    throw new AppError("Chat is undefined", 404);
  }

  const message = await MessageModel.create({
    chatId: chatId,
    user: id,
    text: text,
  });

  sendOkResponse(res, 201, message);
}

async function updateMessageText(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }
  const { chatId, messageId } = req.params;
  const { text } = req.body;
  const { id } = req.user;

  const message = await MessageModel.findOne({
    chatId: chatId,
    user: id,
    _id: messageId,
  });

  if (message === null) {
    throw new AppError("Message is undefined");
  }

  message.text = text;

  await message.save();

  sendOkResponse(res, 200, message);
}

async function deleteMessage(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware Error", 500);
  }
  const { chatId, messageId } = req.params;
  const { id } = req.user;

  const message = await MessageModel.findOne({
    chatId: chatId,
    user: id,
    _id: messageId,
  });

  if (message === null) {
    throw new AppError("Message is undefined");
  }

  await message.deleteOne();

  sendOkResponse(res, 204, null);
}

export {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  updateMessageText,
};

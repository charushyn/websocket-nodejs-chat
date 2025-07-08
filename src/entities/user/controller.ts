import "dotenv/config";

import { Request, Response } from "express";
import { sendOkResponse } from "../../responses";
import { UserModel, UserType } from "./model";
import { AppError } from "../../utils/types/AppError";

async function getUsers(req: Request, res: Response) {
  const users = await UserModel.findOne().lean().exec();

  sendOkResponse(res, 200, users);
}

async function getUserById(req: Request, res: Response) {
  const { userId } = req.params;

  const user = await UserModel.findById(userId).populate("chats").lean().exec();

  if (user === null) {
    throw new AppError("User undefined", 404);
  }

  sendOkResponse(res, 200, user);
}

async function createUser(req: Request, res: Response) {
  const { email, username } = req.body;
}

export { getUsers, getUserById };

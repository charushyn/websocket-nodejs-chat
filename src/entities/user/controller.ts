import "dotenv/config";

import { Request, Response } from "express";
import { sendOkResponse } from "../../responses";
import { UserModel, UserType } from "./model";
import { AppError } from "../../utils/types/AppError";
import createToken from "../../utils/jwt/createToken";
import bcrypt from "bcrypt";

async function getUsers(req: Request, res: Response) {
  const users = await UserModel.findOne().lean().select("-password").exec();

  sendOkResponse(res, 200, [users]);
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
  const { email, username, password } = req.body;

  const userWithEmail = await UserModel.findOne({ email: email }).lean().exec();
  const userWithUsername = await UserModel.findOne({ username: username })
    .lean()
    .exec();

  if (userWithEmail !== null) {
    throw new AppError("User with this email already exist", 409);
  }

  if (userWithUsername !== null) {
    throw new AppError("User with this username already exist", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user_body: UserType = {
    email: email,
    username: username,
    chats: [],
    password: hashedPassword,
  };

  const user = await UserModel.create(user_body);

  const token = createToken({ email: user.email });

  res.header("Authorization", `Bearer ${token}`);

  sendOkResponse(res, 201, user);
}

async function authenticateUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email: email }).lean().exec();

  if (user === null) {
    throw new AppError("User is undefined", 404);
  }

  const isPasswordSame = await bcrypt.compare(password, user.password);

  if (!isPasswordSame) {
    throw new AppError("Wrong password", 401);
  }

  const token = createToken({ email: user.email });

  res.header("Authorization", `Bearer ${token}`);

  sendOkResponse(res, 200, null);
}

async function updateUsername(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware error", 100);
  }

  const { id } = req.user;

  const { username } = req.body;
  const { userId } = req.params;

  if (id.toString() !== userId) {
    throw new AppError("You don't have enough rules to do this.", 403);
  }

  const user = await UserModel.findByIdAndUpdate(
    id,
    { username: username },
    { new: true }
  )
    .lean()
    .select("-password")
    .exec();

  if (user === null) {
    throw new AppError("User undefined!!", 404);
  }

  sendOkResponse(res, 200, user);
}

async function deleteUser(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Auth Middleware error", 100);
  }

  const { id } = req.user;

  const { userId } = req.params;

  if (id.toString() !== userId) {
    throw new AppError("You don't have enough rules to do this.", 403);
  }

  const user = await UserModel.findByIdAndDelete(userId).lean().exec();

  if (user === null) {
    throw new AppError("User is undefined!!", 404);
  }

  sendOkResponse(res, 204, null);
}

export {
  getUsers,
  getUserById,
  createUser,
  authenticateUser,
  updateUsername,
  deleteUser,
};

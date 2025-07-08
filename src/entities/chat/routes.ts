import express from "express";
import { validateRequest } from "../../utils/middleware/validateRequest";
import { body, header, param } from "express-validator";

const router = express.Router();

router.get("/", validateRequest, getChats);

router.get(
  "/:chatId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  validateRequest,
  getChatById
);

router.post(
  "/",
  body("title")
    .isString()
    .isLength({ min: 1, max: 25 })
    .withMessage(
      "Title should be a string and length should be between 1 a 25 chars"
    ),
  validateRequest,
  createChat
);

router.patch(
  "/:chatId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  body("title")
    .isString()
    .isLength({ min: 1, max: 25 })
    .withMessage(
      "Title should be a string and length should be between 1 a 25 chars"
    ),
  validateRequest,
  updateChatTitle
);

router.delete(
  "/:chatId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  validateRequest,
  deleteChat
);

router.patch(
  "/:chatId/users/join",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  body("userId").isMongoId().withMessage("userId should be a MongoId"),
  validateRequest,
  joinToChat
);

router.patch(
  "/:chatId/users/leave",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  body("userId").isMongoId().withMessage("userId should be a MongoId"),
  validateRequest,
  leaveFromChat
);

export { router as user_router };

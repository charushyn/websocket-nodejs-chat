import express from "express";
import { validateRequest } from "../../utils/middleware/validateRequest";
import { body, header, param } from "express-validator";
import passport from "../../utils/middleware/authMiddleware";

import {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageText,
  deleteMessage,
} from "./controller";

const router = express.Router();

router.get(
  "/:chatId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  getMessages
);

router.get(
  "/:chatId/:messageId",
  param("messageId").isMongoId().withMessage("/:messageId should be a MongoId"),
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  getMessageById
);

router.post(
  "/:chatId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  body("text")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Text in message should be a string and message's length should be between 1 a 100 chars"
    ),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  createMessage
);

router.patch(
  "/:chatId/:messageId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  param("messageId").isMongoId().withMessage("/:messageId should be a MongoId"),
  body("text")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Text in message should be a string and message's length should be between 1 a 100 chars"
    ),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  updateMessageText
);

router.delete(
  "/:chatId/:messageId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  param("messageId").isMongoId().withMessage("/:messageId should be a MongoId"),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  deleteMessage
);

export { router as message_router };

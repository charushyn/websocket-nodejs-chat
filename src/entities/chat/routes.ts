import express from "express";
import { validateRequest } from "../../utils/middleware/validateRequest";
import { body, header, param } from "express-validator";
import {
  createChat,
  getChats,
  getChatById,
  updateChatTitle,
  deleteChat,
  joinToChat,
  leaveFromChat,
} from "./controller";
import passport from "../../utils/middleware/authMiddleware";

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
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
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
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  updateChatTitle
);

router.delete(
  "/:chatId",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  validateRequest,
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  passport.authenticate("bearer", { session: false }),
  deleteChat
);

router.patch(
  "/:chatId/users/join",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  joinToChat
);

router.patch(
  "/:chatId/users/leave",
  param("chatId").isMongoId().withMessage("/:chatId should be a MongoId"),
  header("Authorization")
    .notEmpty()
    .withMessage("Auth header missing")
    .contains("Bearer")
    .withMessage("Auth format is Bearer <token>"),
  validateRequest,
  passport.authenticate("bearer", { session: false }),
  leaveFromChat
);

export { router as chat_router };

import express from "express";
import { validateRequest } from "../../utils/middleware/validateRequest";
import { body, header, param } from "express-validator";

const router = express.Router();

router.get("/", validateRequest, getMessages);

router.get(
  "/:messageId",
  param("messageId").isMongoId().withMessage("/:messageId should be a MongoId"),
  validateRequest,
  getMessageById
);

router.post(
  "/",
  body("user").isMongoId().withMessage("user should be a MongoId"),
  body("text")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Text in message should be a string and message's length should be between 1 a 100 chars"
    ),
  body("chatId").isMongoId().withMessage("chatId should be a MongoId"),
  validateRequest,
  createMessage
);

router.patch(
  "/:messageId",
  param("messageId").isMongoId().withMessage("/:messageId should be a MongoId"),
  body("text")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Text in message should be a string and message's length should be between 1 a 100 chars"
    ),
  validateRequest,
  updateMessageText
);

router.delete(
  "/:messageId",
  param("messageId").isMongoId().withMessage("/:messageId should be a MongoId"),
  validateRequest,
  deleteMessage
);

export { router as message_router };

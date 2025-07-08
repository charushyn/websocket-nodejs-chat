import express from "express";
import { validateRequest } from "../../utils/middleware/validateRequest";
import { body, header, param } from "express-validator";

const router = express.Router();

router.get("/", validateRequest, getUsers);

router.get(
  "/:userId",
  param("userId")
    .isMongoId()
    .withMessage("/:userId should be a string and MongoId"),
  validateRequest,
  getUserById
);

router.post(
  "/authenticate",
  body("email").isEmail().withMessage("Email should be an email"),
  body("password")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Password should be between 1 a 20 chars"),
  validateRequest,
  createUser
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email should be an email"),
  body("username")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Username should be a string and be between 1 a 20 chars"),
  body("password")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Password should be between 1 a 20 chars"),
  validateRequest,
  createUser
);

router.patch(
  "/:userId/username",
  param("userId")
    .isMongoId()
    .withMessage("/:userId should be a string and MongoId"),
  body("username")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Username should be a string and be between 1 a 20 chars"),
  validateRequest,
  updateUsername
);

router.delete(
  "/:userId",
  param("userId")
    .isMongoId()
    .withMessage("/:userId should be a string and MongoId"),
  validateRequest,
  deleteUser
);

export { router as user_router };

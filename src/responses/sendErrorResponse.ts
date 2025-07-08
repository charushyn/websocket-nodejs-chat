import { Response } from "express";
import { AppError } from "../utils/types/AppError";

const sendErrorResponse = (
  res: Response,
  error: Error | AppError,
  status = 500
) => {
  res.status(status).json({
    error: error.message,
    ...(error instanceof AppError && error.data ? { details: error.data } : {}),
  });
};

export { sendErrorResponse };

import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../types/AppError";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const jsonBody: { [key: string]: unknown } = {
      message: err.message,
    };
    if (err.data) {
      jsonBody.data = err.data;
    }
    res.status(err.statusCode).json(jsonBody);
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      message: err.message || "Unexpected error",
    });
    return;
  }

  res.status(500).json({
    message: "Unknown error",
  });
  return;
};

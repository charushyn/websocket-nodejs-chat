import "dotenv/config";
import { AppError } from "../../utils/types/AppError";
import jwt from "jsonwebtoken";

type CreateTokenProps = {
  email: string;
};

export default function createToken({ email }: CreateTokenProps): string {
  if (!process.env.JWT_SECRET) {
    throw new AppError("AUTH CREATE SERICE UNAVALIABLE", 503);
  }

  const signed_token = jwt.sign({ email: email }, process.env.JWT_SECRET);

  return signed_token;
}

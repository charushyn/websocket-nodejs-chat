import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { UserModel } from "../../entities/user/model";
import { AppError } from "../types/AppError";

const jwt_secret = process.env.JWT_SECRET;

export async function verifyTokenAndGetUser(token: string) {
  if (!jwt_secret)
    throw new AppError("Services with Auth are unavailable", 503);

  let decoded;
  try {
    decoded = jwt.verify(token, jwt_secret);
  } catch (e) {
    if (e instanceof JsonWebTokenError)
      throw new AppError("Invalid token", 401);
    throw new AppError("Unknown error", 500);
  }

  if (!decoded || typeof decoded !== "object" || !("email" in decoded)) {
    throw new AppError("Invalid jwt body", 401);
  }

  const user = await UserModel.findOne({ email: decoded.email }).lean().exec();

  if (!user) throw new AppError("User is undefined", 401);

  return { email: user.email, id: user._id };
}

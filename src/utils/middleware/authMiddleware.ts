import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { UserModel } from "../../entities/user/model";
import { AppError } from "../types/AppError";

const jwt_secret = process.env.JWT_SECRET;

passport.use(
  new BearerStrategy(async function (token, done) {
    if (!jwt_secret) {
      return done(new AppError("Services with Auth are unavailable", 503));
    }

    try {
      const decoded = jwt.verify(token, jwt_secret);

      if (!decoded || typeof decoded !== "object" || !("email" in decoded)) {
        return done(new AppError("Invalid jwt body", 401));
      }

      const user = await UserModel.findOne({ email: decoded.email })
        .lean()
        .exec();

      if (!user) {
        return done(new AppError("User is undefined", 401));
      }

      return done(null, {
        email: user.email,
        id: user._id,
      });
    } catch (e: unknown) {
      if (e instanceof JsonWebTokenError) {
        return done(new AppError("Invalid token", 401));
      }
      return done(new AppError("Unknown error", 500));
    }
  })
);

export default passport;

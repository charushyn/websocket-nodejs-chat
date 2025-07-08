import { Schema, Types, model } from "mongoose";

interface UserType {
  email: string;
  username: string;
  chats: Types.ObjectId[];
  token: string;
}

const UserSchema = new Schema<UserType>({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  chats: { type: [Schema.Types.ObjectId], required: true },
  token: { type: String, required: true },
});

const UserModel = model<UserType>("User", UserSchema, "users");

export { UserType, UserModel };

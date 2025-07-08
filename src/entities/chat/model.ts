import { Schema, Types, model } from "mongoose";

interface ChatType {
  title: string;
  users: Types.ObjectId[];
}

const ChatSchema = new Schema<ChatType>({
  title: { type: String, required: true },
  users: { type: [Schema.Types.ObjectId], required: true },
});

const ChatModel = model<ChatType>("Chat", ChatSchema, "chats");

export { ChatType, ChatModel };

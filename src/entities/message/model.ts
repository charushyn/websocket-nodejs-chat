import { Schema, Types, model } from "mongoose";

interface MessageType {
  user: Types.ObjectId;
  text: string;
  chatId: Types.ObjectId;
}

const MessageSchema = new Schema<MessageType>({
  user: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  chatId: { type: Schema.Types.ObjectId, required: true },
});

const MessageModel = model<MessageType>("Message", MessageSchema, "messages");

export { MessageType, MessageModel };

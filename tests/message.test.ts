import request from "supertest";
import app from "../src/app";
import { MessageType } from "../src/entities/message/model";
import { Types } from "mongoose";

describe("/messages", () => {
  let createdMessageId: string;

  it("POST should create a message", async () => {
    const message: MessageType = {
      text: "message!",
      user: new Types.ObjectId(),
      chatId: new Types.ObjectId(),
    };

    const { body } = await request(app)
      .post("/messages")
      .send(message)
      .expect(201);

    expect(body).toMatchObject({
      text: message.text,
      user: message.user.toString(),
      chatId: message.chatId.toString(),
    });

    createdMessageId = body._id;
  });

  it("GET should return array with created message", async () => {
    const { body } = await request(app).get("/messages").expect(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET should return created message", async () => {
    const { body } = await request(app)
      .get(`/messages/${createdMessageId}`)
      .expect(200);
    expect(body._id).toEqual(createdMessageId);
  });

  it("PATCH should update message text", async () => {
    const newText = { text: "updated!" };
    const { body } = await request(app)
      .patch(`/messages/${createdMessageId}`)
      .send(newText)
      .expect(200);

    expect(body.text).toBe(newText.text);
  });

  it("DELETE should remove message and check it by GET", async () => {
    await request(app).delete(`/messages/${createdMessageId}`).expect(204);
    await request(app).get(`/messages/${createdMessageId}`).expect(404);
  });
});

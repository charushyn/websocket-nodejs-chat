import "dotenv/config";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL || "");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/messages", () => {
  let createdUserId: string;
  let headerAuthValue: string;
  let createdChatId: string;
  let createdMessageId: string;

  it("POST /users should create a user", async () => {
    const user = {
      email: "testmsg@gmail.com",
      username: "testmsg",
      password: "password",
    };

    const { body, header } = await request(app)
      .post("/users")
      .send(user)
      .expect(201);

    createdUserId = body._id;
    headerAuthValue = header["authorization"];
    expect(headerAuthValue).toMatch(/Bearer /);
  });

  it("POST /chats should create a chat with that user", async () => {
    const { body } = await request(app)
      .post("/chats")
      .set("Authorization", headerAuthValue)
      .send({ title: "Chat for messages test" })
      .expect(201);

    expect(body._id).toBeTruthy();
    expect(body.users).toContain(createdUserId);
    createdChatId = body._id;
  });

  it("POST /messages/:chatId should create a message", async () => {
    const { body } = await request(app)
      .post(`/messages/${createdChatId}`)
      .set("Authorization", headerAuthValue)
      .send({ text: "Hello, message!" })
      .expect(201);

    expect(body.text).toBe("Hello, message!");
    expect(body.chatId).toBe(createdChatId);
    expect(body.user).toBe(createdUserId);

    createdMessageId = body._id;
  });

  it("GET /messages/:chatId should return all messages in chat", async () => {
    const { body } = await request(app)
      .get(`/messages/${createdChatId}`)
      .set("Authorization", headerAuthValue)
      .expect(200);

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]._id).toBe(createdMessageId);
  });

  it("GET /messages/:chatId/:messageId should return single message", async () => {
    const { body } = await request(app)
      .get(`/messages/${createdChatId}/${createdMessageId}`)
      .set("Authorization", headerAuthValue)
      .expect(200);

    expect(body._id).toBe(createdMessageId);
    expect(body.text).toBe("Hello, message!");
  });

  it("PATCH /messages/:chatId/:messageId should update message text", async () => {
    const newText = "Updated message text!";

    const { body } = await request(app)
      .patch(`/messages/${createdChatId}/${createdMessageId}`)
      .set("Authorization", headerAuthValue)
      .send({ text: newText })
      .expect(200);

    expect(body._id).toBe(createdMessageId);
    expect(body.text).toBe(newText);
  });

  it("DELETE /messages/:chatId/:messageId should delete the message", async () => {
    await request(app)
      .delete(`/messages/${createdChatId}/${createdMessageId}`)
      .set("Authorization", headerAuthValue)
      .expect(204);

    await request(app)
      .get(`/messages/${createdChatId}/${createdMessageId}`)
      .set("Authorization", headerAuthValue)
      .expect(404);
  });
});

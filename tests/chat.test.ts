import request from "supertest";
import app from "../src/app";
import { ChatType } from "../src/entities/chat/model";
import { Types } from "mongoose";

describe("/messages", () => {
  let createdChatId: string;
  let creatorId: string;

  it("POST should create a chat", async () => {
    const chat: ChatType = {
      title: "some title",
      users: [new Types.ObjectId()],
      creator: new Types.ObjectId(),
    };

    const { body } = await request(app).post("/chats").send(chat).expect(201);

    expect(body).toMatchObject({
      text: chat.title,
      creator: chat.creator.toString(),
      users: chat.users.map((user) => {
        return user.toString();
      }),
    });

    createdChatId = body._id;
    creatorId = body.creator;
  });

  it("GET should return array with created chats", async () => {
    const { body } = await request(app).get("/chats").expect(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET should return single created Chat", async () => {
    const { body } = await request(app)
      .get(`/chats/${createdChatId}`)
      .expect(200);
    expect(body).toContain({ _id: createdChatId });
  });

  it("PATCH should update chat's title", async () => {
    const newTitle = { title: "updated title!" };
    const { body } = await request(app)
      .patch(`/chats/${createdChatId}`)
      .send(newTitle)
      .expect(200);

    expect(body.creator).toEqual(creatorId);
    expect(body.title).toEqual(newTitle);
  });

  it("DELETE should remove chat", async () => {
    await request(app).delete(`/chats/${createdChatId}`).expect(204);
    await request(app).get(`/chats/${createdChatId}`).expect(404);
  });
});

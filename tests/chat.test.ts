import "dotenv/config";

import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
// import { UserType } from "../src/entities/user/model";

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL || "");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/chats", () => {
  let createdChatId: string;
  let createdUserId: string;
  let headerAuthValue: string;

  it("POST should create a user (SPECIALLY FOR CREATING USER)", async () => {
    const user = {
      email: "reserved@gmail.com",
      username: "reserved",
      password: "password",
    };

    const { body, header } = await request(app)
      .post("/users")
      .send(user)
      .expect(201);

    expect(body.email).toEqual(user.email);
    expect(body.username).toEqual(user.username);
    expect(header["authorization"]).toMatch(/Bearer /);

    createdUserId = body._id;
    headerAuthValue = header["authorization"];
  });

  it("POST should create a chat", async () => {
    const chat = {
      title: "some title",
    };

    const { body } = await request(app)
      .post("/chats")
      .set("Authorization", headerAuthValue)
      .send(chat)
      .expect(201);

    expect(typeof body.title).toBe("string");

    createdChatId = body._id;
  });

  it("GET should return array with created chats", async () => {
    const { body } = await request(app).get("/chats").expect(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET should return single created Chat", async () => {
    const { body } = await request(app)
      .get(`/chats/${createdChatId}`)
      .expect(200);
    expect(body._id).toEqual(createdChatId);
  });

  it("PATCH should update chat's title", async () => {
    const newTitle = { title: "updated title!" };
    const { body } = await request(app)
      .patch(`/chats/${createdChatId}`)
      .set("Authorization", headerAuthValue)
      .send(newTitle)
      .expect(200);

    expect(body.title).toEqual(newTitle.title);
  });

  it("DELETE should remove chat", async () => {
    await request(app)
      .delete(`/chats/${createdChatId}`)
      .set("Authorization", headerAuthValue)
      .expect(204);
    await request(app).get(`/chats/${createdChatId}`).expect(404);
  });

  it("DELETE should remove user (SCPECCIALY)", async () => {
    await request(app)
      .delete(`/users/${createdUserId}`)
      .set("Authorization", headerAuthValue)
      .expect(204);
    await request(app)
      .get(`/users/${createdUserId}`)
      .set("Authorization", headerAuthValue)
      .expect(404);
  });
});

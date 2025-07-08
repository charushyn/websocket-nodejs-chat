import request from "supertest";
import app from "../src/app";
import { UserType } from "../src/entities/user/model";

describe("/messages", () => {
  let createdUserId: string;

  it("POST should create a user", async () => {
    const user: UserType = {
      email: "test@gmail.com",
      username: "test",
      chats: [],
      token: "token:test",
    };

    const { body } = await request(app).post("/users").send(user).expect(201);

    expect(body).toMatchObject({
      email: user.email,
      username: user.username,
      chats: user.chats,
      token: user.token,
    });

    createdUserId = body._id;
  });

  it("GET should return array with created users", async () => {
    const { body } = await request(app).get("/users").expect(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET should return single created user", async () => {
    const { body } = await request(app)
      .get(`/users/${createdUserId}`)
      .expect(200);
    expect(body._id).toEqual(createdUserId);
  });

  it("PATCH should update user's username", async () => {
    const newUsername = { username: "updated username!" };
    const { body } = await request(app)
      .patch(`/users/${createdUserId}`)
      .send(newUsername)
      .expect(200);

    expect(body._id).toEqual(createdUserId);
    expect(body.username).toEqual(newUsername);
  });

  it("DELETE should remove user", async () => {
    await request(app).delete(`/users/${createdUserId}`).expect(204);
    await request(app).get(`/users/${createdUserId}`).expect(404);
  });
});

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

describe("/users", () => {
  let createdUserId: string;
  let headerAuthValue: string;

  it("POST should create a user", async () => {
    const user = {
      email: "test@gmail.com",
      username: "test",
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
      .patch(`/users/${createdUserId}/username`)
      .set("Authorization", headerAuthValue)
      .send(newUsername)
      .expect(200);

    expect(body._id).toEqual(createdUserId);
    expect(body.username).toEqual(newUsername.username);
  });

  it("DELETE should remove user", async () => {
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

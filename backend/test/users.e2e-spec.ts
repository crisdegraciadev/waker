import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { UsersModule } from "../src/api/users/users.module";
import resetDb from "./helpers/reset-db";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_USER_DTO_1 } from "./fixtures/users";
import { SharedModule } from "~/shared/shared.module";

describe("UsersController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;

  beforeEach(async () => {
    app = await createTestApp(SharedModule, UsersModule);
    api = app.getHttpServer();
    await resetDb();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /users", () => {
    it("should return 201 OK and the created user", async () => {
      const expectedFields = ["id", "email"];

      const { body, statusCode } = await request(api).post("/users").send(CREATE_USER_DTO_1);

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(CREATE_USER_DTO_1.email).toBe(body.email);
      expect(body).not.toHaveProperty("password");
    });

    it("should return 400 BAD REQUEST if fields are missing", async () => {
      const testCases = [
        { payload: {}, message: "email should not be empty" },
        { payload: { email: "test@email.com" }, message: "password should not be empty" },
        { payload: { email: "test@email.com", password: "123456789" }, message: "confirmPassword should not be empty" },
        { payload: { email: "test@email.com", confirmPassword: "123456789" }, message: "password should not be empty" },
        { payload: { password: "123456789", confirmPassword: "123456789" }, message: "email should not be empty" },
      ];

      for (const { payload, message } of testCases) {
        const { body, statusCode } = await request(api).post("/users").send(payload);

        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 400 BAD REQUEST if password and confirmPassword doesn't match", async () => {
      const { body, statusCode } = await request(api)
        .post("/users")
        .send({
          ...CREATE_USER_DTO_1,
          confirmPassword: "1234567890",
        });

      expect(statusCode).toBe(400);
      expect(body.message).toContain("password and confirmPassword doesn't match");
    });

    it("should return 409 CONFLICT if user already exists", async () => {
      await request(api).post("/users").send(CREATE_USER_DTO_1);
      const { body, statusCode } = await request(api).post("/users").send(CREATE_USER_DTO_1);

      expect(statusCode).toBe(409);
      expect(body.message).toBe("email already in use");
    });
  });
});

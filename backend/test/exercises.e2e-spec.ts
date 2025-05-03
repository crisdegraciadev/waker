import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { ExercisesModule } from "~/api/exercises/exercises.module";
import { UsersModule } from "../src/api/users/users.module";
import { DatabaseModule } from "../src/config/database/database.module";
import { createTestApp } from "./config/test-app.factory";
import genJwt from "./helpers/gen-jwt";
import resetDb from "./helpers/reset-db";

describe("ExercisesController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;
  let authToken: string;

  beforeEach(async () => {
    app = await createTestApp(DatabaseModule, UsersModule, ExercisesModule);
    api = app.getHttpServer();
    await resetDb();

    authToken = await genJwt(api);

  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /exercises", () => {
    const createExerciseDto = {
      name: "Push-ups",
      difficulty: "MEDIUM",
      type: "BODY_WEIGHT",
    };

    it("should create an exercise and return 201", async () => {
      const { userId } = JSON.parse(Buffer.from(authToken.split(".")[1], "base64").toString());
      const payload = { ...createExerciseDto, userId };

      const { statusCode } = await request(api).post("/exercises").set("Authorization", `Bearer ${authToken}`).send(payload);

      expect(statusCode).toBe(201);
    });
  });
});

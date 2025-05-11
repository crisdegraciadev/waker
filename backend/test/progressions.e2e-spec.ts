/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { ProgressionsModule } from "~/api/progressions/progressions.module";
import { WorkoutsModule } from "~/api/workouts/workouts.module";
import { SharedModule } from "~/shared/shared.module";
import { UsersModule } from "../src/api/users/users.module";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_USER_DTO_1 } from "./fixtures/users";
import { CREATE_WORKOUT_DTO_1 } from "./fixtures/workouts";
import authRequest from "./helpers/auth-request";
import generateJwt from "./helpers/gen-jwt";
import resetDb from "./helpers/reset-db";

describe("ProgressionsController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;
  let authToken: string;
  let WORKOUT_ID: number;

  beforeEach(async () => {
    app = await createTestApp(SharedModule, UsersModule, WorkoutsModule, ProgressionsModule);
    api = app.getHttpServer();
    await resetDb();

    authToken = await generateJwt(api, CREATE_USER_DTO_1);

    const { post } = authRequest(api, authToken);
    const { body } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);
    WORKOUT_ID = body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /workouts/:workoutId/progressions", () => {
    it("should return 201 OK and create a progression", async () => {
      const expectedFields = ["id", "workoutId", "createdAt"];

      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(body.workoutId).toBe(WORKOUT_ID);
      expect(body.createdAt).toBeDefined();
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post("/workouts/abc/progressions");

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { post } = authRequest(api, "");
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post("/workouts/999/progressions");

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });
  });

  describe("GET /workouts/:workoutId/progressions/:id", () => {
    it("should return 200 OK and get a progression", async () => {
      const { post, get } = authRequest(api, authToken);

      const { body: progression } = await post(`/workouts/${WORKOUT_ID}/progressions`);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${progression.id}`);

      expect(statusCode).toBe(200);

      expect(body).toMatchObject({
        id: progression.id,
        workoutId: progression.workoutId,
        createdAt: progression.createdAt,
      });
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get("/workouts/${WORKOUT_ID}/progressions");

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/999`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });
  });

  describe("GET /workouts/:workoutId/progressions", () => {
    beforeEach(async () => {
      const { post } = authRequest(api, authToken);
      await post(`/workouts/${WORKOUT_ID}/progressions`);
      await post(`/workouts/${WORKOUT_ID}/progressions`);
      await post(`/workouts/${WORKOUT_ID}/progressions`);
      await post(`/workouts/${WORKOUT_ID}/progressions`);
    }, 15_000);

    it("should return 200 OK and get all progressions with pagination", async () => {
      const { get } = authRequest(api, authToken);

      const { body: firstPageBody, statusCode: firstPageStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions?page=1&limit=2`);

      expect(firstPageStatusCode).toBe(200);
      expect(firstPageBody.data).toHaveLength(2);
      expect(firstPageBody.pageable).toEqual({
        pageNumber: 1,
        pageSize: 2,
        totalEntities: 4,
        totalPages: 2,
        nextPage: 2,
        prevPage: 1,
      });

      const { body: secondPageBody, statusCode: secondPageStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions?page=2&limit=2`);

      expect(secondPageStatusCode).toBe(200);
      expect(secondPageBody.data).toHaveLength(2);
      expect(secondPageBody.pageable).toEqual({
        pageNumber: 2,
        pageSize: 2,
        totalEntities: 4,
        totalPages: 2,
        nextPage: 2,
        prevPage: 1,
      });
    });

    it("should return 200 OK with default pagination values", async () => {
      const { get } = authRequest(api, authToken);

      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.pageable).toEqual({
        pageNumber: 1,
        pageSize: 10,
        totalEntities: 4,
        totalPages: 1,
        nextPage: 1,
        prevPage: 1,
      });
    });

    it("should return 200 OK with progressions order by createdAt in descendent order by default", async () => {
      const { get } = authRequest(api, authToken);

      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);

      const [p1, p2, p3, p4] = body.data;

      expect(new Date(p1.createdAt) > new Date(p2.createdAt)).toBeTruthy();
      expect(new Date(p2.createdAt) > new Date(p3.createdAt)).toBeTruthy();
      expect(new Date(p3.createdAt) > new Date(p4.createdAt)).toBeTruthy();
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });
  });

  describe("DELETE /workouts/:workoutId/progressions/:id", () => {
    it("should return 204 NO CONTENT and delete a progression", async () => {
      const { post, del, get } = authRequest(api, authToken);
      const { body: progression } = await post(`/workouts/${WORKOUT_ID}/progressions`);
      const { statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/${progression.id}`);

      expect(statusCode).toBe(204);

      const { statusCode: getStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${progression.id}`);

      expect(getStatusCode).toBe(404);
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { del } = authRequest(api, "");
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/1`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/999`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });
  });
});

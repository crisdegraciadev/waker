import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { ExercisesModule } from "~/api/exercises/exercises.module";
import { UsersModule } from "../src/api/users/users.module";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_EXERCISE_DTO } from "./fixtures/exercise";
import { CREATE_USER_DTO_1, CREATE_USER_DTO_2 } from "./fixtures/users";
import authRequest from "./helpers/auth-request";
import extractUserIdFromToken from "./helpers/extract-user-from-token";
import generateJwt from "./helpers/gen-jwt";
import resetDb from "./helpers/reset-db";
import { SharedModule } from "~/shared/shared.module";

describe("ExercisesController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;
  let authToken: string;

  beforeEach(async () => {
    app = await createTestApp(SharedModule, UsersModule, ExercisesModule);
    api = app.getHttpServer();
    await resetDb();

    authToken = await generateJwt(api, CREATE_USER_DTO_1);
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /exercises", () => {
    it("should return 201 OK and create an exercise", async () => {
      const expectedFields = ["id", "name", "difficulty", "type", "userId"];

      const userId = extractUserIdFromToken(authToken);

      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post("/exercises").send(CREATE_EXERCISE_DTO);

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(CREATE_EXERCISE_DTO.name).toBe(body.name);
      expect(CREATE_EXERCISE_DTO.difficulty).toBe(body.difficulty);
      expect(CREATE_EXERCISE_DTO.type).toBe(body.type);
      expect(userId).toBe(body.userId);
    });

    it("should return 400 BAD REQUEST if fields are missing or invalid", async () => {
      const testCases = [
        {
          payload: {},
          message: "name should not be empty",
        },
        {
          payload: { name: "Push-ups" },
          message: "difficulty should not be empty",
        },
        {
          payload: { name: "Push-ups", difficulty: "MEDIUM" },
          message: "type should not be empty",
        },
        {
          payload: { name: "Push-ups", difficulty: "INVALID", type: "BODY_WEIGHT" },
          message: "difficulty must be one of the following values: EASY, MEDIUM, HARD",
        },
        {
          payload: { name: "Push-ups", difficulty: "MEDIUM", type: "INVALID" },
          message: "type must be one of the following values: BODY_WEIGHT, WEIGHT, STRETCH, MOBILITY",
        },
      ];

      for (const { payload, message } of testCases) {
        const { post } = authRequest(api, authToken);
        const { body, statusCode } = await post("/exercises").send(payload);

        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { post } = authRequest(api, "");
      const { body, statusCode } = await post("/exercises").send({});

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 409 CONFLICT if exercise already exists", async () => {
      const { post } = authRequest(api, authToken);
      await post("/exercises").send(CREATE_EXERCISE_DTO);
      const { body, statusCode } = await post("/exercises").send(CREATE_EXERCISE_DTO);

      expect(statusCode).toBe(409);

      expect(body).toEqual({
        statusCode: 409,
        message: "resource already exists",
      });
    });
  });

  describe("GET /exercises/:id", () => {
    it("should return 200 OK and get an exercise", async () => {
      const { post, get } = authRequest(api, authToken);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO);

      const { body, statusCode } = await get(`/exercises/${exercise.id}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        id: exercise.id,
        name: exercise.name,
        difficulty: exercise.difficulty,
        type: exercise.type,
        userId: exercise.userId,
      });
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get("/exercises/1");

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if exercise does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises/1");

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });

    it("should return 404 NOT FOUND if exercise does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Exercise } = await reqUser1.post("/exercises").send(CREATE_EXERCISE_DTO);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      await reqUser2.post("/exercises").send(CREATE_EXERCISE_DTO);

      const { body, statusCode } = await reqUser2.get(`/exercises/${user1Exercise.id}`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });

    it("should return 409 CONFLICT if exercise is created twice by the same user", async () => {
      const { post } = authRequest(api, authToken);
      await post("/exercises").send(CREATE_EXERCISE_DTO);

       await post("/exercises").send(CREATE_EXERCISE_DTO);
      const { body, statusCode } = await post("/exercises").send(CREATE_EXERCISE_DTO);

      expect(statusCode).toBe(409);
      expect(body.message).toBe("resource already exists");
    });
  });

  describe("GET /exercises", () => {
    it("should return 200 OK and get all exercises with pagination", async () => {
      const { post, get } = authRequest(api, authToken);
      
      // Crear varios ejercicios
      await post("/exercises").send(CREATE_EXERCISE_DTO);
      await post("/exercises").send({ ...CREATE_EXERCISE_DTO, name: "Pull-ups" });
      await post("/exercises").send({ ...CREATE_EXERCISE_DTO, name: "Squats" });

      const { body, statusCode } = await get("/exercises?page=1&limit=2");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.meta).toEqual({
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      });
    });

    it("should return 200 OK with default pagination values", async () => {
      const { post, get } = authRequest(api, authToken);
      
      // Crear varios ejercicios
      await post("/exercises").send(CREATE_EXERCISE_DTO);
      await post("/exercises").send({ ...CREATE_EXERCISE_DTO, name: "Pull-ups" });

      const { body, statusCode } = await get("/exercises");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should return 400 BAD REQUEST if pagination values are invalid", async () => {
      const { get } = authRequest(api, authToken);
      
      const testCases = [
        { query: "page=0&limit=10", message: "page must not be less than 1" },
        { query: "page=1&limit=0", message: "limit must not be less than 1" },
        { query: "page=abc&limit=10", message: "page must be an integer number" },
        { query: "page=1&limit=abc", message: "limit must be an integer number" },
      ];

      for (const { query, message } of testCases) {
        const { body, statusCode } = await get(`/exercises?${query}`);
        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get("/exercises");

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

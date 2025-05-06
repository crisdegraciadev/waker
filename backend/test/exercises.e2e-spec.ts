import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { ExercisesModule } from "~/api/exercises/exercises.module";
import { UsersModule } from "../src/api/users/users.module";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_EXERCISE_DTO_1, CREATE_EXERCISE_DTO_2, CREATE_EXERCISE_DTO_3, CREATE_EXERCISE_DTO_4 } from "./fixtures/exercise";
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
      const { body, statusCode } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(CREATE_EXERCISE_DTO_1.name).toBe(body.name);
      expect(CREATE_EXERCISE_DTO_1.difficulty).toBe(body.difficulty);
      expect(CREATE_EXERCISE_DTO_1.type).toBe(body.type);
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
      await post("/exercises").send(CREATE_EXERCISE_DTO_1);
      const { body, statusCode } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      expect(statusCode).toBe(409);
      expect(body.message).toBe("name is already in use");
    });
  });

  describe("GET /exercises/:id", () => {
    it("should return 200 OK and get an exercise", async () => {
      const { post, get } = authRequest(api, authToken);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      const { body, statusCode } = await get(`/exercises/${exercise.id}`);

      expect(statusCode).toBe(200);

      expect(body).toMatchObject({
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
      const { body: user1Exercise } = await reqUser1.post("/exercises").send(CREATE_EXERCISE_DTO_1);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      await reqUser2.post("/exercises").send(CREATE_EXERCISE_DTO_1);

      const { body, statusCode } = await reqUser2.get(`/exercises/${user1Exercise.id}`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });
  });

  describe("GET /exercises", () => {
    beforeEach(async () => {
      const { post } = authRequest(api, authToken);
      await post("/exercises").send(CREATE_EXERCISE_DTO_1);
      await post("/exercises").send(CREATE_EXERCISE_DTO_2);
      await post("/exercises").send(CREATE_EXERCISE_DTO_3);
      await post("/exercises").send(CREATE_EXERCISE_DTO_4);
    });

    it("should return 200 OK and get all exercises with pagination", async () => {
      const { get } = authRequest(api, authToken);

      const { body: firstPageBody, statusCode: firstPageStatusCode } = await get("/exercises?page=1&limit=2");

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

      const { body: secondPageBody, statusCode: secondPageStatusCode } = await get("/exercises?page=2&limit=2");

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

      const { body, statusCode } = await get("/exercises");

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

    it("should return 200 OK if filter exercises by name", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?name=push");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toBe("Push ups");
    });

    it("should return 200 OK if filter exercises by difficulty", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?difficulty=HARD");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.data.map((e: any) => e.name)).toEqual(expect.arrayContaining(["Pull ups", "Deadlift"]));
    });

    it("should return 200 OK if filter exercises by type", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?type=WEIGHT");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.data.map((e: any) => e.name)).toEqual(expect.arrayContaining(["Squats", "Deadlift"]));
    });

    it("should return 200 OK if filter exercises by multiple criteria", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?difficulty=HARD&type=BODY_WEIGHT");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toBe("Pull ups");
    });

    it("should return 200 OK with empty array when no exercises match the filters", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?name=nonExistent");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(0);
    });

    it("should return 200 OK if sort exercises by name ascending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=name&order=asc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Deadlift", "Pull ups", "Push ups", "Squats"]);
    });

    it("should return 200 OK if sort exercises by name descending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=name&order=desc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Squats", "Push ups", "Pull ups", "Deadlift"]);
    });

    it("should return 200 OK if sort exercises by difficulty ascending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=difficulty&order=asc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Squats", "Push ups", "Pull ups", "Deadlift"]);
    });

    it("should return 200 OK if sort exercises by difficulty descending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=difficulty&order=desc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Pull ups", "Deadlift", "Push ups", "Squats"]);
    });

    it("should return 200 OK if sort exercises by type ascending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=type&order=asc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Push ups", "Pull ups", "Squats", "Deadlift"]);
    });

    it("should return 200 OK if sort exercises by type descending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=type&order=desc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Squats", "Deadlift", "Push ups", "Pull ups"]);
    });

    it("should return 200 OK if sort exercises by createdAt ascending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=createdAt&order=asc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Push ups", "Pull ups", "Squats", "Deadlift"]);
    });

    it("should return 200 OK if sort exercises by createdAt descending", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=createdAt&order=desc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Deadlift", "Squats", "Pull ups", "Push ups"]);
    });

    it("should return 200 OK if sort exercises with default order", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=name");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Deadlift", "Pull ups", "Push ups", "Squats"]);
    });

    it("should return 200 OK if sort exercises with default field", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?order=desc");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data.map((e: any) => e.name)).toEqual(["Squats", "Push ups", "Pull ups", "Deadlift"]);
    });

    it("should return 200 OK if sort exercises with filters", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/exercises?sortBy=difficulty&order=desc&type=WEIGHT");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.data.map((e: any) => e.name)).toEqual(["Deadlift", "Squats"]);
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

  describe("DELETE /exercises/:id", () => {
    it("should return 204 NO CONTENT if exercise is deleted", async () => {
      const { post, del } = authRequest(api, authToken);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      const { statusCode } = await del(`/exercises/${exercise.id}`);

      expect(statusCode).toBe(204);

      const { get } = authRequest(api, authToken);
      const { statusCode: getStatusCode } = await get(`/exercises/${exercise.id}`);
      expect(getStatusCode).toBe(404);
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { del } = authRequest(api, "");
      const { body, statusCode } = await del("/exercises/1");

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if exercise does not exist", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del("/exercises/999");

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });

    it("should return 404 NOT FOUND if exercise does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Exercise } = await reqUser1.post("/exercises").send(CREATE_EXERCISE_DTO_1);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { body, statusCode } = await reqUser2.del(`/exercises/${user1Exercise.id}`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });
  });

  describe("PATCH /exercises/:id", () => {
    it("should return 200 OK if exercise is updated", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      const updateDto = {
        name: "Modified Push ups",
        difficulty: "HARD",
        type: "WEIGHT",
      };

      const { body, statusCode } = await patch(`/exercises/${exercise.id}`).send(updateDto);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: exercise.id,
        name: updateDto.name,
        difficulty: updateDto.difficulty,
        type: updateDto.type,
      });
    });

    it("should return 200 OK if exercise is partially updated", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      const updateDto = {
        name: "Modified Push ups",
      };

      const { body, statusCode } = await patch(`/exercises/${exercise.id}`).send(updateDto);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: exercise.id,
        name: updateDto.name,
        difficulty: exercise.difficulty,
        type: exercise.type,
      });
    });

    it("should return 400 BAD REQUEST if fields are invalid", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO_1);

      const testCases = [
        {
          payload: { difficulty: "INVALID" },
          message: "difficulty must be one of the following values: EASY, MEDIUM, HARD",
        },
        {
          payload: { type: "INVALID" },
          message: "type must be one of the following values: BODY_WEIGHT, WEIGHT, STRETCH, MOBILITY",
        },
      ];

      for (const { payload, message } of testCases) {
        const { body, statusCode } = await patch(`/exercises/${exercise.id}`).send(payload);
        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { patch } = authRequest(api, "");
      const { body, statusCode } = await patch("/exercises/1").send({});

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if exercise does not exist", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch("/exercises/999").send({ name: "New Name" });

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });

    it("should return 404 NOT FOUND if exercise does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Exercise } = await reqUser1.post("/exercises").send(CREATE_EXERCISE_DTO_1);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { body, statusCode } = await reqUser2.patch(`/exercises/${user1Exercise.id}`).send({ name: "New Name" });

      expect(statusCode).toBe(404);
      expect(body.message).toBe("exercise not found");
    });

    it("should return 409 CONFLICT if new name is already in use", async () => {
      const { post, patch } = authRequest(api, authToken);
      await post("/exercises").send(CREATE_EXERCISE_DTO_1);
      const { body: exercise } = await post("/exercises").send(CREATE_EXERCISE_DTO_2);

      const { body, statusCode } = await patch(`/exercises/${exercise.id}`).send({ name: CREATE_EXERCISE_DTO_1.name });

      expect(statusCode).toBe(409);
      expect(body.message).toBe("name is already in use");
    });
  });
});

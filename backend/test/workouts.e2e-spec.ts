import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { WorkoutsModule } from "~/api/workouts/workouts.module";
import { SharedModule } from "~/shared/shared.module";
import { UsersModule } from "../src/api/users/users.module";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_USER_DTO_1, CREATE_USER_DTO_2 } from "./fixtures/users";
import { CREATE_WORKOUT_DTO_1, CREATE_WORKOUT_DTO_2, CREATE_WORKOUT_DTO_3, CREATE_WORKOUT_DTO_4 } from "./fixtures/workouts";
import authRequest from "./helpers/auth-request";
import extractUserIdFromToken from "./helpers/extract-user-from-token";
import generateJwt from "./helpers/gen-jwt";
import resetDb from "./helpers/reset-db";

describe("WorkoutsController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;
  let authToken: string;

  beforeEach(async () => {
    app = await createTestApp(SharedModule, UsersModule, WorkoutsModule);
    api = app.getHttpServer();
    await resetDb();

    authToken = await generateJwt(api, CREATE_USER_DTO_1);
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /workouts", () => {
    it("should return 201 OK and create a workout", async () => {
      const expectedFields = ["id", "name", "type", "userId"];

      const userId = extractUserIdFromToken(authToken);

      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(CREATE_WORKOUT_DTO_1.name).toBe(body.name);
      expect(CREATE_WORKOUT_DTO_1.type).toBe(body.type);
      expect(userId).toBe(body.userId);
    });

    it("should return 400 BAD REQUEST if fields are missing or invalid", async () => {
      const testCases = [
        {
          payload: {},
          message: "name should not be empty",
        },
        {
          payload: { name: "Full Body Workout" },
          message: "type should not be empty",
        },
        {
          payload: { name: "Full Body Workout", type: "INVALID" },
          message: "type must be one of the following values: CALISTHENICS, WEIGHTS, MIXED, CARDIO, TABATA, HIIT",
        },
      ];

      for (const { payload, message } of testCases) {
        const { post } = authRequest(api, authToken);
        const { body, statusCode } = await post("/workouts").send(payload);

        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { post } = authRequest(api, "");
      const { body, statusCode } = await post("/workouts").send({});

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 409 CONFLICT if workout already exists", async () => {
      const { post } = authRequest(api, authToken);
      await post("/workouts").send(CREATE_WORKOUT_DTO_1);
      const { body, statusCode } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);

      expect(statusCode).toBe(409);
      expect(body.message).toBe("name is already in use");
    });
  });

  describe("GET /workouts/:id", () => {
    it("should return 200 OK and get a workout", async () => {
      const { post, get } = authRequest(api, authToken);
      const { body: workout } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);

      const { body, statusCode } = await get(`/workouts/${workout.id}`);

      expect(statusCode).toBe(200);

      expect(body).toMatchObject({
        id: workout.id,
        name: workout.name,
        type: workout.type,
        userId: workout.userId,
      });
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get("/workouts/1");

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/workouts/1");

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if workout does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Workout } = await reqUser1.post("/workouts").send(CREATE_WORKOUT_DTO_1);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      await reqUser2.post("/workouts").send(CREATE_WORKOUT_DTO_1);

      const { body, statusCode } = await reqUser2.get(`/workouts/${user1Workout.id}`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });
  });

  describe("GET /workouts", () => {
    beforeEach(async () => {
      const { post } = authRequest(api, authToken);
      await post("/workouts").send(CREATE_WORKOUT_DTO_1);
      await post("/workouts").send(CREATE_WORKOUT_DTO_2);
      await post("/workouts").send(CREATE_WORKOUT_DTO_3);
      await post("/workouts").send(CREATE_WORKOUT_DTO_4);
    });

    it("should return 200 OK and get all workouts with pagination", async () => {
      const { get } = authRequest(api, authToken);

      const { body: firstPageBody, statusCode: firstPageStatusCode } = await get("/workouts?page=1&limit=2");

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

      const { body: secondPageBody, statusCode: secondPageStatusCode } = await get("/workouts?page=2&limit=2");

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

      const { body, statusCode } = await get("/workouts");

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

    it("should return 200 OK if filter workouts by name", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/workouts?name=full");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toBe("Full Body Workout");
    });

    it("should return 200 OK if filter workouts by type", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/workouts?type=WEIGHTS");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toBe("Upper Body Workout");
    });

    it("should return 200 OK with empty array when no workouts match the filters", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get("/workouts?name=nonExistent");

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(0);
    });
  });

  describe("PATCH /workouts/:id", () => {
    it("should return 200 OK and update a workout", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: workout } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);

      const updateDto = {
        name: "Updated Workout",
        type: "HIIT",
      };

      const { body, statusCode } = await patch(`/workouts/${workout.id}`).send(updateDto);

      expect(statusCode).toBe(200);
      expect(body.name).toBe(updateDto.name);
      expect(body.type).toBe(updateDto.type);
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { patch } = authRequest(api, "");
      const { body, statusCode } = await patch("/workouts/1").send({});

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch("/workouts/1").send({ name: "Updated Workout" });

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if workout does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Workout } = await reqUser1.post("/workouts").send(CREATE_WORKOUT_DTO_1);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { body, statusCode } = await reqUser2.patch(`/workouts/${user1Workout.id}`).send({ name: "Updated Workout" });

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 409 CONFLICT if new name is already in use", async () => {
      const { post, patch } = authRequest(api, authToken);
      await post("/workouts").send(CREATE_WORKOUT_DTO_1);
      const { body: workout } = await post("/workouts").send(CREATE_WORKOUT_DTO_2);

      const { body, statusCode } = await patch(`/workouts/${workout.id}`).send({ name: CREATE_WORKOUT_DTO_1.name });

      expect(statusCode).toBe(409);
      expect(body.message).toBe("name is already in use");
    });
  });

  describe("DELETE /workouts/:id", () => {
    it("should return 204 NO CONTENT and delete a workout", async () => {
      const { post, del, get } = authRequest(api, authToken);
      const { body: workout } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);

      const { statusCode } = await del(`/workouts/${workout.id}`);

      expect(statusCode).toBe(204);

      const { statusCode: getStatusCode } = await get(`/workouts/${workout.id}`);

      expect(getStatusCode).toBe(404);
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { del } = authRequest(api, "");
      const { body, statusCode } = await del("/workouts/1");

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del("/workouts/1");

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if workout does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Workout } = await reqUser1.post("/workouts").send(CREATE_WORKOUT_DTO_1);

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { body, statusCode } = await reqUser2.del(`/workouts/${user1Workout.id}`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });
  });
});

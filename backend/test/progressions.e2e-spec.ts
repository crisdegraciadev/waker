/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { ActivitiesModule } from "~/api/activities/activities.module";
import { ProgressionsModule } from "~/api/progressions/progressions.module";
import { WorkoutsModule } from "~/api/workouts/workouts.module";
import { SharedModule } from "~/shared/shared.module";
import { UsersModule } from "../src/api/users/users.module";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_ACTIVITY_DTO_1, CREATE_ACTIVITY_DTO_2, CREATE_ACTIVITY_DTO_3 } from "./fixtures/activities";
import { CREATE_EXERCISE_DTO_1 } from "./fixtures/exercises";
import { CREATE_USER_DTO_1, CREATE_USER_DTO_2 } from "./fixtures/users";
import { CREATE_WORKOUT_DTO_1 } from "./fixtures/workouts";
import authRequest from "./helpers/auth-request";
import generateJwt from "./helpers/gen-jwt";
import resetDb from "./helpers/reset-db";
import { ExercisesModule } from "~/api/exercises/exercises.module";
import { CREATE_PROGRESSION_DTO_1 } from "./fixtures/progressions";

describe("ProgressionsController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;
  let authToken: string;
  let WORKOUT_ID: number;
  let EXERCISE_ID: number;

  beforeEach(async () => {
    app = await createTestApp(SharedModule, UsersModule, WorkoutsModule, ActivitiesModule, ExercisesModule, ProgressionsModule);
    api = app.getHttpServer();
    await resetDb();

    authToken = await generateJwt(api, CREATE_USER_DTO_1);

    const { post } = authRequest(api, authToken);

    const { body } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);
    WORKOUT_ID = body.id;

    const { body: exerciseBody } = await post(`/exercises`).send(CREATE_EXERCISE_DTO_1);
    EXERCISE_ID = exerciseBody.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /workouts/:workoutId/progressions", () => {
    it("should return 201 OK and create a progression", async () => {
      const expectedFields = ["id", "workoutId", "createdAt", "activitiesOrder"];

      const { post, get } = authRequest(api, authToken);

      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions`).send({
        ...CREATE_PROGRESSION_DTO_1,
        activities: [
          { ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID },
          { ...CREATE_ACTIVITY_DTO_2, exerciseId: EXERCISE_ID },
          { ...CREATE_ACTIVITY_DTO_3, exerciseId: EXERCISE_ID },
        ],
      });

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(body.workoutId).toBe(WORKOUT_ID);
      expect(body.createdAt).toBeDefined();
      expect(body.activitiesOrder).toBeDefined();

      expect(Array.isArray(body.activitiesOrder)).toBe(true);
      expect(body.activitiesOrder).toHaveLength(3);

      const progressionId = body.id;
      const { body: activitiesResponse } = await get(`/workouts/${WORKOUT_ID}/progressions/${progressionId}/activities`);

      expect(activitiesResponse).toHaveLength(3);

      const activityIds = activitiesResponse.map((activity: any) => activity.id);
      expect(body.activitiesOrder).toEqual(expect.arrayContaining(activityIds));
      expect(body.activitiesOrder).toHaveLength(activityIds.length);
    });

    it("should return 400 BAD REQUEST if fields are missing or invalid", async () => {
      const testCases = [
        {
          payload: {},
          message: "activities must be an array",
        },
        {
          payload: { activities: [] },
          message: "activities must contain at least 1 elements",
        },
        {
          payload: { activities: [{ ...CREATE_ACTIVITY_DTO_1 }] },
          message: "activities.0.exerciseId should not be empty",
        },
      ];

      for (const { payload, message } of testCases) {
        const { post } = authRequest(api, authToken);
        const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions`).send(payload);

        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { post } = authRequest(api, "");
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post("/workouts/999/progressions").send({
        ...CREATE_PROGRESSION_DTO_1,
        activities: [{ ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID }],
      });

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });
  });

  describe("GET /workouts/:workoutId/progressions/:id", () => {
    it("should return 200 OK and get a progression", async () => {
      const { post, get } = authRequest(api, authToken);

      const { body: progression } = await post(`/workouts/${WORKOUT_ID}/progressions`).send({
        ...CREATE_PROGRESSION_DTO_1,
        activities: [{ ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID }],
      });

      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${progression.id}`);

      expect(statusCode).toBe(200);

      expect(body).toMatchObject({
        id: progression.id,
        workoutId: progression.workoutId,
        createdAt: progression.createdAt,
      });

      expect(body.activitiesOrder).toBeDefined();
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

      const createProgressionDto = {
        ...CREATE_PROGRESSION_DTO_1,
        activities: [{ ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID }],
      };

      await post(`/workouts/${WORKOUT_ID}/progressions`).send(createProgressionDto);
      await post(`/workouts/${WORKOUT_ID}/progressions`).send(createProgressionDto);
      await post(`/workouts/${WORKOUT_ID}/progressions`).send(createProgressionDto);
      await post(`/workouts/${WORKOUT_ID}/progressions`).send(createProgressionDto);
    }, 15_000);

    it("should return 200 OK and get all progressions with pagination", async () => {
      const { get } = authRequest(api, authToken);

      const { body: firstPageBody, statusCode: firstPageStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions?page=0&limit=2`);

      expect(firstPageStatusCode).toBe(200);
      expect(firstPageBody.data).toHaveLength(2);
      expect(firstPageBody.pageable).toEqual({
        pageNumber: 0,
        pageSize: 2,
        totalEntities: 4,
        totalPages: 2,
        nextPage: 1,
        prevPage: 0,
      });

      const { body: secondPageBody, statusCode: secondPageStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions?page=1&limit=2`);

      expect(secondPageStatusCode).toBe(200);
      expect(secondPageBody.data).toHaveLength(2);
      expect(secondPageBody.pageable).toEqual({
        pageNumber: 1,
        pageSize: 2,
        totalEntities: 4,
        totalPages: 2,
        nextPage: 2,
        prevPage: 0,
      });
    });

    it("should return 200 OK with default pagination values", async () => {
      const { get } = authRequest(api, authToken);

      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions`);

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.pageable).toEqual({
        pageNumber: 0,
        pageSize: 10,
        totalEntities: 4,
        totalPages: 1,
        nextPage: 1,
        prevPage: 0,
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

      const { body: progression } = await post(`/workouts/${WORKOUT_ID}/progressions`).send({
        ...CREATE_PROGRESSION_DTO_1,
        activities: [
          { ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID },
          { ...CREATE_ACTIVITY_DTO_2, exerciseId: EXERCISE_ID },
          { ...CREATE_ACTIVITY_DTO_3, exerciseId: EXERCISE_ID },
        ],
      });

      const { statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/${progression.id}`);
      expect(statusCode).toBe(204);

      const { statusCode: getProgressionStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${progression.id}`);
      expect(getProgressionStatusCode).toBe(404);
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

  describe("PATCH /workouts/:workoutId/progressions/:id", () => {
    let PROGRESSION: any;

    beforeEach(async () => {
      const { post } = authRequest(api, authToken);

      const { body: progressionBody } = await post(`/workouts/${WORKOUT_ID}/progressions`).send({
        ...CREATE_PROGRESSION_DTO_1,
        activities: [
          { ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID },
          { ...CREATE_ACTIVITY_DTO_2, exerciseId: EXERCISE_ID },
          { ...CREATE_ACTIVITY_DTO_3, exerciseId: EXERCISE_ID },
        ],
      });

      PROGRESSION = progressionBody;
    });

    it("should return 200 OK and update a progression", async () => {
      const { patch } = authRequest(api, authToken);

      const newActivitiesOrder = PROGRESSION.activitiesOrder.toReversed();
      const newDate = new Date();

      const updateDto = {
        activitiesOrder: newActivitiesOrder,
        createdAt: newDate,
      };

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION.id}`).send(updateDto);

      expect(statusCode).toBe(200);

      expect(body).toMatchObject({
        id: PROGRESSION.id,
        workoutId: PROGRESSION.workoutId,
        activitiesOrder: newActivitiesOrder,
        createdAt: newDate.toISOString(),
      });
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { patch } = authRequest(api, authToken);

      const updateDto = {
        activitiesOrder: [1, 2, 3],
      };

      const { body, statusCode } = await patch(`/workouts/abc/progressions/1`).send(updateDto);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if progressionId is not a number", async () => {
      const { patch } = authRequest(api, authToken);

      const updateDto = {
        activitiesOrder: [1, 2, 3],
      };

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/abc`).send(updateDto);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if activitiesOrder length does not match activities length", async () => {
      const { patch } = authRequest(api, authToken);

      const updateDto = {
        activitiesOrder: [1, 2, 3, 4],
      };

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION.id}`).send(updateDto);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("activities length missmatch");
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { patch } = authRequest(api, "");
      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/1`).send({});

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { patch } = authRequest(api, authToken);

      const updateDto = {
        activitiesOrder: [1, 2, 3],
      };

      const { body, statusCode } = await patch(`/workouts/999/progressions/1`).send(updateDto);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { patch } = authRequest(api, authToken);

      const updateDto = {
        activitiesOrder: [1, 2, 3],
      };

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/999`).send(updateDto);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });

    it("should return 404 NOT FOUND if progression does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);

      const { body: user1Progression } = await reqUser1.post(`/workouts/${WORKOUT_ID}/progressions`).send({
        ...CREATE_PROGRESSION_DTO_1,
        activities: [{ ...CREATE_ACTIVITY_DTO_1, exerciseId: EXERCISE_ID }],
      });

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const updateDto = {
        activitiesOrder: [1, 2, 3],
      };

      const { statusCode } = await reqUser2.patch(`/workouts/${WORKOUT_ID}/progressions/${user1Progression.id}`).send(updateDto);

      expect(statusCode).toBe(404);
    });
  });
});

import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { ActivitiesModule } from "~/api/activities/activities.module";
import { ExercisesModule } from "~/api/exercises/exercises.module";
import { ProgressionsModule } from "~/api/progressions/progressions.module";
import { WorkoutsModule } from "~/api/workouts/workouts.module";
import { SharedModule } from "~/shared/shared.module";
import { UsersModule } from "../src/api/users/users.module";
import { createTestApp } from "./config/test-app.factory";
import { CREATE_ACTIVITY_DTO_1 } from "./fixtures/activities";
import { CREATE_EXERCISE_DTO_1, CREATE_EXERCISE_DTO_2 } from "./fixtures/exercises";
import { CREATE_USER_DTO_1, CREATE_USER_DTO_2 } from "./fixtures/users";
import { CREATE_WORKOUT_DTO_1 } from "./fixtures/workouts";
import authRequest from "./helpers/auth-request";
import generateJwt from "./helpers/gen-jwt";
import resetDb from "./helpers/reset-db";

describe("ActivitiesController (e2e)", () => {
  let app: INestApplication<App>;
  let api: App;
  let authToken: string;
  let WORKOUT_ID: number;
  let PROGRESSION_ID: number;
  let EXERCISE_ID: number;

  beforeEach(async () => {
    app = await createTestApp(SharedModule, UsersModule, WorkoutsModule, ProgressionsModule, ExercisesModule, ActivitiesModule);
    api = app.getHttpServer();
    await resetDb();

    authToken = await generateJwt(api, CREATE_USER_DTO_1);

    const { post } = authRequest(api, authToken);

    const { body: workoutBody } = await post("/workouts").send(CREATE_WORKOUT_DTO_1);
    WORKOUT_ID = workoutBody.id;

    const { body: progressionBody } = await post(`/workouts/${WORKOUT_ID}/progressions`);
    PROGRESSION_ID = progressionBody.id;

    const { body: exerciseBody } = await post(`/exercises`).send(CREATE_EXERCISE_DTO_1);
    EXERCISE_ID = exerciseBody.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /workouts/:workoutId/progressions/:progressionId/activities", () => {
    it("should return 201 OK and create an activity", async () => {
      const expectedFields = ["id", "sets", "reps", "progressionId", "exerciseId"];

      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();

      expect(body.exerciseId).toBe(EXERCISE_ID);
      expect(body.progressionId).toBe(PROGRESSION_ID);

      expect(body.sets).toBe(CREATE_ACTIVITY_DTO_1.sets);
      expect(body.reps).toBe(CREATE_ACTIVITY_DTO_1.reps);

      expect(body.improvement).toBeNull();
      expect(body.weight).toBeNull();
    });

    it("should return 201 OK and create an activity with weight", async () => {
      const expectedFields = ["id", "sets", "reps", "progressionId", "exerciseId", "weight"];

      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
        weight: 20,
      });

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(body.exerciseId).toBe(EXERCISE_ID);
      expect(body.progressionId).toBe(PROGRESSION_ID);
      expect(body.sets).toBe(CREATE_ACTIVITY_DTO_1.sets);
      expect(body.reps).toBe(CREATE_ACTIVITY_DTO_1.reps);
      expect(body.weight).toBe(20);
      expect(body.improvement).toBeNull();
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post(`/workouts/abc/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if progressionId is not a number", async () => {
      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions/abc/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if fields are missing or invalid", async () => {
      const testCases = [
        {
          payload: {},
          message: "exerciseId should not be empty",
        },
        {
          payload: { exerciseId: EXERCISE_ID },
          message: "sets should not be empty",
        },
        {
          payload: { exerciseId: EXERCISE_ID, sets: 3 },
          message: "reps should not be empty",
        },
        {
          payload: { exerciseId: EXERCISE_ID, sets: 3, reps: 10, weight: -1 },
          message: "weight must be a positive number",
        },
      ];

      for (const { payload, message } of testCases) {
        const { post } = authRequest(api, authToken);
        const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send(payload);

        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { post } = authRequest(api, "");
      const { body, statusCode } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { post } = authRequest(api, authToken);
      const { body, statusCode } = await post(`/workouts/999/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });
  });

  describe("GET /workouts/:workoutId/progressions/:progressionId/activities/:activityId", () => {
    it("should return 200 OK and get an activity", async () => {
      const { post, get } = authRequest(api, authToken);
      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: activity.id,
        exerciseId: activity.exerciseId,
        progressionId: activity.progressionId,
        sets: activity.sets,
        reps: activity.reps,
        weight: activity.weight,
        improvement: activity.improvement,
      });
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/abc/progressions/${PROGRESSION_ID}/activities/1`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if progressionId is not a number", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/abc/activities/1`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if activityId is not a number", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/abc`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/1`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/999/progressions/${PROGRESSION_ID}/activities/1`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/999/activities/1`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });

    it("should return 404 NOT FOUND if activity does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/999`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("activity not found");
    });

    it("should return 404 NOT FOUND if activity does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Activity } = await reqUser1.post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { statusCode } = await reqUser2.get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${user1Activity.id}`);

      expect(statusCode).toBe(404);
    });
  });

  describe("GET /workouts/:workoutId/progressions/:progressionId/activities", () => {
    beforeEach(async () => {
      const { post } = authRequest(api, authToken);
      await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });
      await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });
      await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });
    });

    it("should return 200 OK and get an array of activities of a progression", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`);

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(3);
    });

    it("should return 200 OK and get an empty array of activities", async () => {
      const { post, get } = authRequest(api, authToken);
      const { body: progression } = await post(`/workouts/${WORKOUT_ID}/progressions`);

      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${progression.id}/activities`);

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(0);
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/abc/progressions/${PROGRESSION_ID}/activities`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if progressionId is not a number", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/abc/activities`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { get } = authRequest(api, "");
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/999/progressions/${PROGRESSION_ID}/activities`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { get } = authRequest(api, authToken);
      const { body, statusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/999/activities`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });
  });

  describe("PATCH /workouts/:workoutId/progressions/:progressionId/activities/:activityId", () => {
    it("should return 200 OK and update an activity", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const updateDto = {
        sets: 4,
        reps: 12,
        weight: 25,
      };

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`).send(updateDto);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: activity.id,
        exerciseId: activity.exerciseId,
        progressionId: activity.progressionId,
        sets: updateDto.sets,
        reps: updateDto.reps,
        weight: updateDto.weight,
        improvement: null,
      });
    });

    it("should return 200 OK and partially update an activity", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const updateDto = {
        sets: 4,
      };

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`).send(updateDto);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: activity.id,
        exerciseId: activity.exerciseId,
        progressionId: activity.progressionId,
        sets: updateDto.sets,
        reps: activity.reps,
        weight: activity.weight,
        improvement: activity.improvement,
      });
    });

    it("should return 200 OK when updating exerciseId", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const { body: newExercise } = await post(`/exercises`).send(CREATE_EXERCISE_DTO_2);

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`).send({
        exerciseId: newExercise.id,
      });

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: activity.id,
        exerciseId: newExercise.id,
        progressionId: activity.progressionId,
        sets: activity.sets,
        reps: activity.reps,
        weight: activity.weight,
        improvement: activity.improvement,
      });
    });

    it("should return 200 OK when updating improvement", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`).send({
        improvement: "INCREASE",
      });

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({
        id: activity.id,
        exerciseId: activity.exerciseId,
        progressionId: activity.progressionId,
        sets: activity.sets,
        reps: activity.reps,
        weight: activity.weight,
        improvement: "INCREASE",
      });
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch(`/workouts/abc/progressions/${PROGRESSION_ID}/activities/1`).send({});

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if progressionId is not a number", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/abc/activities/1`).send({});

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if activityId is not a number", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/abc`).send({});

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if fields are invalid", async () => {
      const { post, patch } = authRequest(api, authToken);
      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const testCases = [
        {
          payload: { sets: -1 },
          message: "sets must be a positive number",
        },
        {
          payload: { reps: -1 },
          message: "reps must be a positive number",
        },
        {
          payload: { weight: -1 },
          message: "weight must be a positive number",
        },
      ];

      for (const { payload, message } of testCases) {
        const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`).send(payload);

        expect(statusCode).toBe(400);
        expect(body.message).toContain(message);
      }
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { patch } = authRequest(api, "");
      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/1`).send({});

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch(`/workouts/999/progressions/${PROGRESSION_ID}/activities/1`).send({});

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/999/activities/1`).send({});

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });

    it("should return 404 NOT FOUND if activity does not exist", async () => {
      const { patch } = authRequest(api, authToken);
      const { body, statusCode } = await patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/999`).send({});

      expect(statusCode).toBe(404);
      expect(body.message).toBe("activity not found");
    });

    it("should return 404 NOT FOUND if activity does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Activity } = await reqUser1.post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { statusCode } = await reqUser2.patch(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${user1Activity.id}`).send({});

      expect(statusCode).toBe(404);
    });
  });

  describe("DELETE /workouts/:workoutId/progressions/:progressionId/activities/:activityId", () => {
    it("should return 204 NO CONTENT and delete an activity", async () => {
      const { post, del, get } = authRequest(api, authToken);

      const { body: activity } = await post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      const { statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`);

      expect(statusCode).toBe(204);

      const { statusCode: getStatusCode } = await get(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${activity.id}`);

      expect(getStatusCode).toBe(404);
    });

    it("should return 400 BAD REQUEST if workoutId is not a number", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/abc/progressions/${PROGRESSION_ID}/activities/1`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if progressionId is not a number", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/abc/activities/1`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 400 BAD REQUEST if activityId is not a number", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/abc`);

      expect(statusCode).toBe(400);
      expect(body.message).toBe("Validation failed (numeric string is expected)");
    });

    it("should return 401 UNAUTHORIZED if user is not authenticated", async () => {
      const { del } = authRequest(api, "");
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/1`);

      expect(statusCode).toBe(401);
      expect(body.message).toBe("Unauthorized");
    });

    it("should return 404 NOT FOUND if workout does not exist", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/999/progressions/${PROGRESSION_ID}/activities/1`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("workout not found");
    });

    it("should return 404 NOT FOUND if progression does not exist", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/999/activities/1`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("progression not found");
    });

    it("should return 404 NOT FOUND if activity does not exist", async () => {
      const { del } = authRequest(api, authToken);
      const { body, statusCode } = await del(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/999`);

      expect(statusCode).toBe(404);
      expect(body.message).toBe("activity not found");
    });

    it("should return 404 NOT FOUND if activity does not belong to user", async () => {
      const reqUser1 = authRequest(api, authToken);
      const { body: user1Activity } = await reqUser1.post(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities`).send({
        ...CREATE_ACTIVITY_DTO_1,
        exerciseId: EXERCISE_ID,
      });

      authToken = await generateJwt(api, CREATE_USER_DTO_2);
      const reqUser2 = authRequest(api, authToken);

      const { statusCode } = await reqUser2.del(`/workouts/${WORKOUT_ID}/progressions/${PROGRESSION_ID}/activities/${user1Activity.id}`);

      expect(statusCode).toBe(404);
    });
  });
});

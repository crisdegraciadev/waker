import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default async function resetDb() {
  await db.$transaction([db.workoutProgression.deleteMany(), db.workout.deleteMany(), db.exercise.deleteMany(), db.user.deleteMany()]);
}

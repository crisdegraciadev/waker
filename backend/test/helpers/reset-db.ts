import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default async function resetDb() {
  await db.$transaction([db.workout.deleteMany(), db.exercise.deleteMany(), db.user.deleteMany()]);
}

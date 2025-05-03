import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default async () => {
  await db.$transaction([db.exercise.deleteMany(), db.user.deleteMany()]);
};

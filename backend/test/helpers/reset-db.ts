
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default async () => {
  await db.$transaction([db.user.deleteMany()]);
};

-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('CALISTHENICS', 'WEIGHTS', 'MIXED', 'CARDIO', 'TABATA', 'HIIT');

-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WorkoutType" NOT NULL DEFAULT 'WEIGHTS',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workout_userId_name_key" ON "Workout"("userId", "name");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

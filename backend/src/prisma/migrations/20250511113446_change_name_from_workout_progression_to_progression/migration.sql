/*
  Warnings:

  - You are about to drop the `WorkoutProgression` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutProgression" DROP CONSTRAINT "WorkoutProgression_workoutId_fkey";

-- DropTable
DROP TABLE "WorkoutProgression";

-- CreateTable
CREATE TABLE "Progression" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progression_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Progression" ADD CONSTRAINT "Progression_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

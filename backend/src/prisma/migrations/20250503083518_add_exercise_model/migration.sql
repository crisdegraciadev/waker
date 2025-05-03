-- CreateEnum
CREATE TYPE "ExerciseDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('BODY_WEIGHT', 'WEIGHT', 'STRETCH', 'MOBILITY');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" "ExerciseDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "type" "ExerciseType" NOT NULL DEFAULT 'WEIGHT',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

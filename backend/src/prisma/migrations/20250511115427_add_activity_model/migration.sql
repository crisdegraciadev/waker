-- CreateEnum
CREATE TYPE "Improvement" AS ENUM ('DECREASE', 'MAINTAIN', 'INCREASE');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER,
    "improvement" "Improvement" NOT NULL DEFAULT 'MAINTAIN',
    "exerciseId" INTEGER NOT NULL,
    "progressionId" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_progressionId_fkey" FOREIGN KEY ("progressionId") REFERENCES "Progression"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

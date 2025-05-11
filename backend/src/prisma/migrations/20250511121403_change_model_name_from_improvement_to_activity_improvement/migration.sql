/*
  Warnings:

  - The `improvement` column on the `Activity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ActivityImprovement" AS ENUM ('DECREASE', 'MAINTAIN', 'INCREASE');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "improvement",
ADD COLUMN     "improvement" "ActivityImprovement" NOT NULL DEFAULT 'MAINTAIN';

-- DropEnum
DROP TYPE "Improvement";

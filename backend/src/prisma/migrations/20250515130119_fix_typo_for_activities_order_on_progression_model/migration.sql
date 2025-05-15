/*
  Warnings:

  - You are about to drop the column `acitivitiesOrder` on the `Progression` table. All the data in the column will be lost.
  - Added the required column `activitiesOrder` to the `Progression` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progression" DROP COLUMN "acitivitiesOrder",
ADD COLUMN     "activitiesOrder" JSONB NOT NULL;

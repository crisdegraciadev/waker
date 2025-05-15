/*
  Warnings:

  - Added the required column `acitivitiesOrder` to the `Progression` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progression" ADD COLUMN     "acitivitiesOrder" JSONB NOT NULL;

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_progressionId_fkey";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_progressionId_fkey" FOREIGN KEY ("progressionId") REFERENCES "Progression"("id") ON DELETE CASCADE ON UPDATE CASCADE;

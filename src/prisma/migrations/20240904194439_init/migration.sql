/*
  Warnings:

  - You are about to drop the column `activities` on the `ProgressReport` table. All the data in the column will be lost.
  - You are about to drop the column `responses` on the `ProgressReport` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ProgressReport` table. All the data in the column will be lost.
  - Added the required column `challenges` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalsMet` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalsUnmet` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `improvementAreas` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientBehaviour` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recomendations` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superVisorRatings` to the `ProgressReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionType` to the `SessionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressReport" DROP COLUMN "activities",
DROP COLUMN "responses",
DROP COLUMN "status",
ADD COLUMN     "challenges" TEXT NOT NULL,
ADD COLUMN     "goalsMet" TEXT NOT NULL,
ADD COLUMN     "goalsUnmet" TEXT NOT NULL,
ADD COLUMN     "improvementAreas" TEXT NOT NULL,
ADD COLUMN     "patientBehaviour" TEXT NOT NULL,
ADD COLUMN     "recomendations" TEXT NOT NULL,
ADD COLUMN     "superVisorRatings" TEXT NOT NULL,
ALTER COLUMN "recommendations" SET NOT NULL,
ALTER COLUMN "recommendations" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SessionLog" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "patientFeedback" TEXT,
ADD COLUMN     "sessionType" TEXT NOT NULL;

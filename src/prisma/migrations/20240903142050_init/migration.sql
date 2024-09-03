/*
  Warnings:

  - You are about to drop the column `supervisorId` on the `ProgressReport` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Supervisor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgressReport" DROP CONSTRAINT "ProgressReport_supervisorId_fkey";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "medicalHistory" SET NOT NULL,
ALTER COLUMN "medicalHistory" SET DATA TYPE TEXT,
ALTER COLUMN "medicalRecords" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProgressReport" DROP COLUMN "supervisorId";

-- AlterTable
ALTER TABLE "Supervisor" DROP COLUMN "rating";

/*
  Warnings:

  - The `workload` column on the `Therapist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "workload",
ADD COLUMN     "workload" INTEGER NOT NULL DEFAULT 0;

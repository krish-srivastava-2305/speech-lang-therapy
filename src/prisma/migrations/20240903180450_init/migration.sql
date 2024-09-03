/*
  Warnings:

  - You are about to drop the column `medicalHistory` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `medicalIssue` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "medicalHistory",
ADD COLUMN     "medicalIssue" TEXT NOT NULL;

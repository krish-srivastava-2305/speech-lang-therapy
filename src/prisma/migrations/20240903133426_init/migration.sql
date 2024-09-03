-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "tokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "tokenExpiry" TIMESTAMP(3);

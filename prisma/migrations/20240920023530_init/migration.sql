-- AlterTable
ALTER TABLE "history" ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "medicines" ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT true;

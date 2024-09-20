/*
  Warnings:

  - You are about to drop the column `function` on the `medicines` table. All the data in the column will be lost.
  - Added the required column `useCase` to the `medicines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "function",
ADD COLUMN     "useCase" TEXT NOT NULL;

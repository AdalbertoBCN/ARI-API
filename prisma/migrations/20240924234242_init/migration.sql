/*
  Warnings:

  - You are about to drop the column `currentDate` on the `history` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateIngestion" DATETIME NOT NULL,
    "historyId" INTEGER NOT NULL,
    CONSTRAINT "logs_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "history" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prescriptionId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "history_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_history" ("id", "prescriptionId", "status") SELECT "id", "prescriptionId", "status" FROM "history";
DROP TABLE "history";
ALTER TABLE "new_history" RENAME TO "history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

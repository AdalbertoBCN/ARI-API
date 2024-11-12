-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "medicines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "useCase" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "medicineId" INTEGER NOT NULL,
    "notes" TEXT,
    "frequencyHours" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "prescriptions_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "prescriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateIngestion" DATETIME NOT NULL,
    "historyId" INTEGER NOT NULL,
    CONSTRAINT "logs_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "history" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prescriptionId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "history_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patients_responsibles" (
    "patientId" INTEGER NOT NULL,
    "responsibleId" INTEGER NOT NULL,

    PRIMARY KEY ("patientId", "responsibleId"),
    CONSTRAINT "patients_responsibles_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patients_responsibles_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_responsibles_patientId_responsibleId_key" ON "patients_responsibles"("patientId", "responsibleId");

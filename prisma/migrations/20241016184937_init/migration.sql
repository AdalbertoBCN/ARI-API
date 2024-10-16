-- CreateTable
CREATE TABLE "patients_responsibles" (
    "patientId" INTEGER NOT NULL,
    "responsibleId" INTEGER NOT NULL,

    PRIMARY KEY ("patientId", "responsibleId"),
    CONSTRAINT "patients_responsibles_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patients_responsibles_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_responsibles_patientId_responsibleId_key" ON "patients_responsibles"("patientId", "responsibleId");

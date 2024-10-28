import { AES } from 'crypto-js';
import { env } from '../env';
import { prisma } from "../../src/http/prisma";

async function main() {
  // TRUNCATE TABLES e RESET AUTO_INCREMENT (SQLite)
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

  try {
    // Deleta os dados das tabelas filhas primeiro (ordem correta)
    await prisma.$executeRaw`DELETE FROM logs;`;
    await prisma.$executeRaw`DELETE FROM history;`;
    await prisma.$executeRaw`DELETE FROM prescriptions;`;
    await prisma.$executeRaw`DELETE FROM patients_responsibles;`;
  
    // Depois, deleta os dados das tabelas principais
    await prisma.$executeRaw`DELETE FROM medicines;`;
    await prisma.$executeRaw`DELETE FROM users;`;
  
    // Reseta as sequências de IDs autoincrementáveis
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'users';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'medicines';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'prescriptions';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'history';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'logs';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'patients_responsibles';`;
  } finally {
    // Reabilita as restrições de chave estrangeira
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
  }

  // Adicionando Usuários
  await prisma.users.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', password: AES.encrypt("alice123", env.CRYPTO_SECRET).toString(), birthDate: new Date('1990-01-01') },
      { name: 'Bob', email: 'bob@example.com', password: AES.encrypt("bob123", env.CRYPTO_SECRET).toString(), birthDate: new Date('1985-05-10') },
      { name: 'Carol', email: 'carol@example.com', password: AES.encrypt("carol123", env.CRYPTO_SECRET).toString(), birthDate: new Date('1992-08-20') },
      { name: 'Dave', email: 'dave@example.com', password: AES.encrypt("dave123", env.CRYPTO_SECRET).toString(), birthDate: new Date('1988-03-15') },
    ],
  });

  // Adicionando Medicamentos
  await prisma.medicines.createMany({
    data: [
      { name: 'Ibuprofeno', useCase: 'Dor e febre', dosage: '200mg' },
      { name: 'Paracetamol', useCase: 'Febre e dor de cabeça', dosage: '500mg' },
      { name: 'Amoxicilina', useCase: 'Infecções bacterianas', dosage: '875mg' },
      { name: 'Omeprazol', useCase: 'Refluxo', dosage: '20mg', status: false },
    ],
  });

  // Adicionando Prescrições
  const prescription1 = await prisma.prescriptions.create({
    data: {
      userId: 1,
      medicineId: 1,
      notes: 'Tomar após as refeições',
      frequencyHours: 8,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  });

  const prescription2 = await prisma.prescriptions.create({
    data: {
      userId: 2,
      medicineId: 2,
      notes: 'Antes de dormir',
      frequencyHours: 12,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    },
  });

  const prescription3 = await prisma.prescriptions.create({
    data: {
      userId: 3,
      medicineId: 3,
      notes: 'A cada 8 horas',
      frequencyHours: 8,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
  });

  const prescription4 = await prisma.prescriptions.create({
    data: {
      userId: 4,
      medicineId: 4,
      notes: 'Em jejum',
      frequencyHours: 24,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  });

  // Adicionando Histórico
  const history1 = await prisma.history.create({
    data: { prescriptionId: prescription1.id },
  });

  const history2 = await prisma.history.create({
    data: { prescriptionId: prescription2.id },
  });

  const history3 = await prisma.history.create({
    data: { prescriptionId: prescription3.id },
  });

  const history4 = await prisma.history.create({
    data: { prescriptionId: prescription4.id },
  });

  // Adicionando Logs
  await prisma.logs.createMany({
    data: [
      { dateIngestion: new Date(), historyId: history1.id },
      { dateIngestion: new Date(), historyId: history2.id },
      { dateIngestion: new Date(), historyId: history3.id },
      { dateIngestion: new Date(), historyId: history4.id },
    ],
  });

  // Adicionando Relacionamentos Paciente/Responsável
  await prisma.patients_responsibles.createMany({
    data: [
      { patientId: 1, responsibleId: 2 },
      { patientId: 3, responsibleId: 4 },
      { patientId: 2, responsibleId: 1 },
      { patientId: 4, responsibleId: 3 },
    ],
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

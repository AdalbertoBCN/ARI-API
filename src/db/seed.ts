import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Apagar todos os usuários
  await prisma.users.deleteMany();

  // Inserir novos usuários
  await prisma.users.createMany({
    data: [
      {
        name: 'Adalberto',
        email: 'adalberto@example.com',
        password: 'adal1', // Lembre-se de criptografar senhas em um ambiente real
        birthDate: new Date('2003-01-17T09:30:00Z'),
      },
      {
        name: 'Matheus',
        email: 'matheus@example.com',
        password: 'teteu1', // Lembre-se de criptografar senhas em um ambiente real
        birthDate: new Date('2002-03-04T11:30:00Z'),
      },
    ],
  });
}

seed()
  .finally(async () => {
    await prisma.$disconnect()
  });

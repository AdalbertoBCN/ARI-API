// src/routes/user/create-user.ts

import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import { AES } from "crypto-js"
import { env } from '../../../env';

export const createUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/users", {
        schema: {
            body: z.object({
                name: z.string().describe('Nome do usuário'),
                email: z.string().email().describe('E-mail do usuário'),
                password: z.string().describe('Senha do usuário'),
                birthDate: z.coerce.date().describe('Data de nascimento do usuário'),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe('Esquema de resposta bem-sucedida'),
            },
            tags: ['Usuário'],
            summary: 'Criação de um novo usuário',
            description: 'Esta rota cria um novo usuário e o salva no banco de dados.',
        }
    }, async (req) => {
        const { name, email, password, birthDate } = req.body;

        const encryptedPassword = AES.encrypt(password, env.CRYPTO_SECRET).toString()

        await prisma.users.create({
            data: {
                name,
                email,
                password: encryptedPassword,
                birthDate
            }
        });

        return {
            message: "Usuário criado com sucesso!"
        }
    });
};

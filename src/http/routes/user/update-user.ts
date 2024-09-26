import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';

export const updateUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.put("/users", {
        schema: {
            body: z.object({
                id: z.coerce.number().describe("Identificador do usuário a ser atualizado"),
                name: z.string().optional().describe("Nome do usuário"),
                email: z.string().email().optional().describe("Email do usuário"),
                password: z.string().optional().describe("Senha do usuário"),
                birthDate: z.coerce.date().optional().describe("Data de nascimento do usuário"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Usuário atualizado com sucesso!")
            },
            tags:["Usuário"],
            summary: 'Atualizar um usuário',
            description: 'Esta rota atualiza um usuário do banco de dados.',
        }
    }, async (req) => {
        const { id, name, email, password, birthDate } = req.body

        await prisma.users.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password,
                birthDate
            }
        });

        return {
            message: "Usuário atualizado com sucesso"
        };
    })
};
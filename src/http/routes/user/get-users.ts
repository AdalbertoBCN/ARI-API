import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import z from 'zod';

export const getUsersRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/users",{
        schema:{
            response:{
                200: z.object({
                    users: z.array(z.object({
                        id: z.number(),
                        name: z.string(),
                        email: z.string(),
                        status: z.boolean()
                    }))
                }).describe("Lista de usuários")
            },
            tags: ["Usuário"],
            summary: "Listar usuários",
            description: "Esta rota retorna uma lista de usuários cadastrados no banco de dados."
        }
    }, async () => {
        const users = await prisma.users.findMany({
            where: {
                status: true
            }
        });

        return {
            users
        }
    })
};
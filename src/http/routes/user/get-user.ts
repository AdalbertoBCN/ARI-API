import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import z from 'zod';
import { authToken } from '@middleware/auth-user-token';
import { userPermission } from '@middleware/user-permission';

export const getUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/users/:id", {
        preHandler: [authToken, userPermission],
        schema: {
            params: z.object({
                id: z.coerce.number().describe("Identificador do usuário")
            }),
            response: {
                200: z.object({
                    user: z.object({
                        id: z.number(),
                        name: z.string(),
                        email: z.string(),
                        birthDate: z.date(),
                        status: z.boolean()
                    }).nullable()
                }).describe("Usuário")
            },
            tags: ["Usuário"],
            summary: "Obter usuário",
            description: "Esta rota retorna um usuário cadastrado no banco de dados pelo ID."
        }
    }, async (request) => {
        const { id } = request.params;

        const user = await prisma.users.findUnique({
            where: {
                id,
                status: true
            },
            select:{
                id: true,
                name: true,
                email: true,
                birthDate: true,
                status: true
            }
        });

        return {
            user
        }
    });
};
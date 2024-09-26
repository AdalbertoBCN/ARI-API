import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';

export const deleteUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/users", {
        schema: {
            body: z.object({
                id: z.coerce.number().describe("Identificador do usuário a ser Deletado")
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Usuário deletado com sucesso!")
            },
            tags:["Usuário"],
            summary: 'Deletar um usuário',
            description: 'Esta rota deleta um usuário do banco de dados.',
        }
    }, async (req) => {
        const { id } = req.body

        await prisma.users.update({
            where: {
                id
            },
            data: {
                status: false,
            }
        });

        return {
            message: "Usuário deletado com sucesso"
        };
    })
};
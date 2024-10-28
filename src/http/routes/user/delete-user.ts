import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import { userPermission } from '@middleware/user-permission';
import { authToken } from '@middleware/auth-user-token';

export const deleteUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/users", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                patientId: z.coerce.number().describe("Identificador do usuário a ser Deletado")
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
        const { patientId } = req.body

        await prisma.users.update({
            where: {
                id: patientId
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
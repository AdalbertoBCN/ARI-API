import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import { userPermission } from '../../../middlewares/user-permission';
import { authToken } from '../../../middlewares/auth-user-token';

export const deleteResponsibleRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/responsibles", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                patientId: z.coerce.number().describe("Id do paciente"),
                userId: z.coerce.number().describe("Id do responsável"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Responsável deletado com sucesso!")
            },
            tags: ["Responsável"],
            summary: 'Deletar um responsável',
            description: 'Esta rota deleta um responsável do banco de dados.',
        }
    }, async (req) => {
        const { patientId, userId } = req.body;

        await prisma.patients_responsibles.delete({
            where: {
                patientId_responsibleId:{
                    responsibleId: userId,
                    patientId: patientId
                }
            }
        });

        return {
            message: "Responsável deletado com sucesso"
        };
    });
};
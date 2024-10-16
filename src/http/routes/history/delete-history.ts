import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { userPermission } from "@middleware/user-permission";
import { authToken } from "@middleware/auth-user-token";

export const deleteHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/history", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                id: z.coerce.number().describe("Identificador do histórico a ser deletado"),
            }),
            response:{
                200: z.object({
                    message: z.string()
                }).describe("Histórico deletado com sucesso")
            },
            tags:["Histórico"],
            summary: 'Deletar um histórico',
            description: 'Esta rota deleta um histórico do banco de dados.',
        }
    }, async (req) => {
        const { id } = req.body;

        await prisma.history.update({
            where: { id },
            data:{
                status: false
            }
        });

        return {
            message: "Histórico deletado com sucesso"
        };
        
    });
};
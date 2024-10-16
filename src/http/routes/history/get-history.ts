import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";
export const getHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/history",{
        preHandler: [authToken, userPermission],
        schema:{
            response:{
                200: z.object({
                    history: z.array(z.object({
                        id: z.number(),
                        prescriptionId: z.number(),
                        status: z.boolean()
                    }))
                }).describe("Lista de históricos")
            },
            tags: ["Histórico"],
            summary: "Listar históricos",
            description: "Esta rota retorna uma lista de históricos cadastrados no banco de dados."
        }
    },async () => {
        const history = await prisma.history.findMany({
            where: {
                status: true
            },
        });
        return {
            history
        };
    });
};
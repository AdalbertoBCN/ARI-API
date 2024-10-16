import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
export const getHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/history",{
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
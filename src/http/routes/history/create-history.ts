import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/history", {
        schema: {
            body: z.object({
                prescriptionId: z.coerce.number().describe("Identificador da prescrição"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Histórico criado com sucesso")
            },
            tags:["Histórico"],
            summary: 'Criar um histórico',
            description: 'Esta rota cria um histórico no banco de dados.',
        }
    }, async (req) => {
        const { prescriptionId } = req.body;

        await prisma.history.create({
            data: {
                prescriptionId
            }
        });

        return {
            message: "Histórico criado com sucesso"
        };
    });
};
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createLogRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/logs", {
        schema: {
            body: z.object({
                historyId: z.coerce.number().describe("Identificador do histórico"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Log criado com sucesso")
            },
            tags:["Log"],
            summary: 'Criar um log',
            description: 'Esta rota cria um log no banco de dados.',
        }
    }, async (req) => {
        const { historyId } = req.body;

        await prisma.logs.create({
            data: {
                historyId,
                dateIngestion: new Date()
            }
        });

        return {
            message: "Log criado com sucesso"
        };
    });
};
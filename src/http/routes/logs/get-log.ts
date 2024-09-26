import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import z from 'zod';

export const getLogsRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/logs",{
        schema:{
            params: z.object({
                historyId: z.coerce.number().describe("Identificador do histórico"),
            }),
            response:{
                200: z.object({
                    logs: z.array(z.object({
                        id: z.number(),
                        historyId: z.number(),
                        dateIngestion: z.string()
                    }))
                }).describe("Lista de logs")
            },
            tags:["Log"],
            summary: 'Listar logs',
            description: 'Esta rota retorna uma lista de logs cadastrados no banco de dados.',
        }
    }, async (req) => {
        const { historyId } = req.params

        const logs = await prisma.logs.findMany({
            where: {
                historyId
            }
        });

        return {
            logs
        }
    })
};
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createLogRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/logs", {
        schema: {
            body: z.object({
                historyId: z.coerce.number(),
            }),
        }
    }, async (req) => {
        const { historyId} = req.body;

        await prisma.logs.create({
            data: {
                historyId,
                dateIngestion: new Date()
            }
        });
    });
};
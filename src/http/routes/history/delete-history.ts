import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const deleteHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/history", {
        schema: {
            body: z.object({
                id: z.coerce.number(),
            }),
        }
    }, async (req) => {
        const { id } = req.body;

        await prisma.history.update({
            where: { id },
            data:{
                status: false
            }
        });
    });
};
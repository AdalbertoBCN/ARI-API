import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/history", {
        schema: {
            body: z.object({
                prescriptionId: z.coerce.number(),
            }),
        }
    }, async (req) => {
        const { prescriptionId } = req.body;

        await prisma.history.create({
            data: {
                prescriptionId
            }
        });
    });
};
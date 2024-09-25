import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const deletePrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/prescription", {
        schema: {
            body: z.object({
                id: z.coerce.number(),
            }),
        }
    }, async (req) => {
        const { id } = req.body;

        await prisma.prescriptions.update({
            where: { id },
            data: {
                status: false
            }
        });;

    });
};
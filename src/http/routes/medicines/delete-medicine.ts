import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const updateUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/medicines", {
        schema: {
            body: z.object({
                id: z.coerce.number(),
            }),
        }
    }, async (req) => {
        const { id } = req.body;

        await prisma.medicines.update({
            where: { id },
            data: {
                status: false
            }
        });;

    });
};
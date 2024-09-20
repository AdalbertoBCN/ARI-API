import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const updateUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.put("/medicines", {
        schema: {
            body: z.object({
                id: z.coerce.number(),
                name: z.string().optional(),
                useCase: z.string().optional(),
                dosage: z.string().optional(),
                status: z.boolean().optional(),
            }),
        }
    }, async (req) => {
        const { id, name, useCase, dosage, status } = req.body;

        await prisma.medicines.update({
            where: { id },
            data: {
                name,
                useCase,
                dosage,
                status
            }
        });;

    });
};
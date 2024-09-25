import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/medicines", {
        schema: {
            body: z.object({
                name: z.string(),
                useCase: z.string(),
                dosage: z.string(),
            }),
        }
    }, async (req) => {
        const { name, useCase, dosage } = req.body;

        await prisma.medicines.create({
            data: {
                name,
                useCase,
                dosage
            }
        });
    });
};
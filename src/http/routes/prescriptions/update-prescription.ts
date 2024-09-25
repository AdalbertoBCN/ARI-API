import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const updatePrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.put("/prescription", {
        schema: {
            body: z.object({
                id: z.coerce.number(),
                frequencyHours: z.coerce.number().optional(),
                notes: z.string().optional().optional(),
                startDate: z.date().optional(),
                endDate: z.date().optional(),
            }),
        }
    }, async (req) => {
        const { id, frequencyHours, notes, startDate, endDate } = req.body;

        await prisma.prescriptions.update({
            where: { id },
            data: {
                frequencyHours,
                notes,
                startDate,
                endDate
            }
        });;

    });
};
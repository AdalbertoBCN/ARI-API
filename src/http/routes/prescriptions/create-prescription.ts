import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createPrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/prescription", {
        schema: {
            body: z.object({
                userId: z.number(),
                medicineId: z.number(),
                frequencyHours: z.number(),
                notes: z.string().optional(),
                startDate: z.date(),
                endDate: z.date(),
            }),
        }
    }, async (req) => {
        const { userId, medicineId, frequencyHours, notes, startDate, endDate  } = req.body;

        await prisma.prescriptions.create({
            data: {
                userId,
                medicineId,
                frequencyHours,
                notes,
                startDate,
                endDate,
            }
        });
    });
};
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const updatePrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.put("/prescriptions", {
        schema: {
            body: z.object({
                id: z.coerce.number().describe("Identificador da prescrição a ser atualizada"),
                frequencyHours: z.coerce.number().optional().describe("Frequência de horas da prescrição"),
                notes: z.string().optional().optional().describe("Notas da prescrição"),
                startDate: z.date().optional().describe("Data de início da prescrição"),
                endDate: z.date().optional().describe("Data de término da prescrição"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Prescrição atualizada com sucesso!")
            },
            tags:["Prescrição"],
            summary: 'Atualizar uma prescrição',
            description: 'Esta rota atualiza uma prescrição no banco de dados.',
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

        return {
            message: "Prescrição atualizada com sucesso"
        };
    });
};
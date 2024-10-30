import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";

export const createPrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/prescriptions", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                userId: z.coerce.number().describe("ID do usuário"),
                medicineId: z.coerce.number().describe("ID do medicamento"),
                frequencyHours: z.coerce.number().describe("Horas de frequência"),
                notes: z.string().optional().describe("Notas").optional(),
                startDate: z.coerce.date().describe("Data de início"),
                endDate: z.coerce.date().describe("Data de término"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Prescrição criada com sucesso")
            },
            tags:["Prescrição"],
            summary: 'Criar uma prescrição',
            description: 'Esta rota cria uma prescrição no banco de dados.',
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

        return {
            message: "Prescrição criada com sucesso"
        };
    });
};
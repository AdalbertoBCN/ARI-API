import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";

export const getHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/history/:prescriptionId",{
        preHandler: [authToken, userPermission],
        schema:{
            params: z.object({
                prescriptionId: z.coerce.number()
            }),
            response:{
                200: z.object({
                    history: z.object({
                        medicineId: z.number(),
                        medicineName: z.string(),
                        dosage: z.string(),
                        useCase: z.string(),
                        notes: z.string().nullable(),
                        frequencyHours: z.number(),
                        startDate: z.date(),
                        logs: z.array(
                          z.object({
                            id: z.number(),
                            dateIngestion: z.date()
                          })
                        )
                      })                      
                }).describe("Lista de históricos")
            },
            tags: ["Histórico"],
            summary: "Listar históricos",
            description: "Esta rota retorna uma lista de históricos cadastrados no banco de dados."
        }
    },async (req) => {
        const { prescriptionId } = req.params;

        const historyResponse = await prisma.history.findMany({
            where: {
                status: true,
                prescriptionId,
            },
            select: {
                logs: {
                    select: {
                        id: true,
                        dateIngestion: true,
                    }
                },
                prescription: {
                    select: {
                        frequencyHours: true,
                        id: true,
                        medicine: {
                            select: {
                                id: true,
                                name: true,
                                dosage: true,
                                useCase: true,
                            }
                        },
                        notes: true,
                        startDate: true,

                    }
                }
            }
        });

        const [history] = historyResponse.map(hist => {

            const { logs, prescription } = hist;

            return {
                medicineId: prescription.medicine.id,
                medicineName: prescription.medicine.name,
                dosage: prescription.medicine.dosage,
                useCase: prescription.medicine.useCase,
                notes: prescription.notes,
                frequencyHours: prescription.frequencyHours,
                startDate: prescription.startDate,
                logs: logs,
              };
        })

        return {
            history
        };
    });
};
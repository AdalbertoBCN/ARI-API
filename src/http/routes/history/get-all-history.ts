import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";

export const getAllHistoryRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/history/all/:patientId",{
        preHandler: [authToken, userPermission],
        schema:{
            params: z.object({
                patientId: z.coerce.number()
            }),
            response:{
                200: z.object({
                    history: z.array(z.object({
                        id: z.number(),
                        medicineId: z.number(),
                        userId: z.number(),
                        userName: z.string(),
                        medicineName: z.string(),
                        dosage: z.string(),
                        useCase: z.string(),
                        notes: z.string().nullable(),
                        frequencyHours: z.number(),
                        startDate: z.date(),
                        endDate: z.date(),
                        logs: z.array(
                          z.object({
                            id: z.number(),
                            dateIngestion: z.date()
                          })
                        )
                      }))                      
                }).describe("Lista de históricos")
            },
            tags: ["Histórico"],
            summary: "Listar históricos",
            description: "Esta rota retorna uma lista de históricos cadastrados no banco de dados."
        }
    },async (req) => {
        const { patientId } = req.params;

        const dependents = await prisma.patients_responsibles.findMany({
            where: {
                responsibleId: patientId
            },
            select: {
                patientId: true
            }
        })

        
        const dependentIds = dependents.map(dependent => dependent.patientId);

        console.log([patientId, ...dependentIds]);

        const historyResponse = await prisma.history.findMany({
            where: {
                status: true,
                prescription: {
                    userId: {
                        in: [patientId, ...dependentIds]
                    }
                },
            },
            select: {
                id: true,
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
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        notes: true,
                        startDate: true,
                        endDate: true

                    }
                }
            }
        });

        const history = historyResponse.map(hist => {

            const { logs, prescription } = hist;

            return {
                id: hist.id,
                medicineId: prescription.medicine.id,
                userId: prescription.user.id,
                userName: prescription.user.name,
                medicineName: prescription.medicine.name,
                dosage: prescription.medicine.dosage,
                useCase: prescription.medicine.useCase,
                notes: prescription.notes,
                frequencyHours: prescription.frequencyHours,
                startDate: prescription.startDate,
                endDate: prescription.endDate,
                logs: logs,
              };
        })

        return {
            history
        };
    });
};
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import { z } from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";

export const getPrescriptionsRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/prescriptions/:patientId",{ 
        preHandler: [authToken, userPermission],
        schema:{
            params:z.object({
                patientId: z.coerce.number()
            }),
            response:{
                200: z.object({
                    prescriptions: z.array(
                        z.object({
                          id: z.number(),
                          name: z.string(),
                          note: z.string().nullable(),
                          frequency: z.number(),
                          startDate: z.date(),
                          endDate: z.date(),
                          patient: z.object({
                            id: z.number(),
                            name: z.string()
                          }),
                          medicine: z.object({
                            id: z.number(),
                            name: z.string(),
                            useCase: z.string(),
                            dosage: z.string()
                          })
                        })
                      )                     
                }).describe("Lista de prescrições")
            },
            tags: ["Prescrição"],
            summary: "Listar prescrições",
            description: "Esta rota retorna uma lista de prescrições cadastradas no banco de dados."
        }
    }, async (req) => {

        const { patientId } = req.params

        const dependents = await prisma.patients_responsibles.findMany({
            where: {
                responsibleId: patientId
            },
            select: {
                patientId: true
            }
        })

        const dependentIds = dependents.map(dependent => dependent.patientId);

        const prescriptionsResponse = await prisma.prescriptions.findMany({
            where: {
            status: true,
            userId: {
                in: [patientId, ...dependentIds]
            },
            medicine: {
                status: true
            }
            },
            include: {
            medicine: {
                select:{
                id: true,
                name: true,
                useCase: true,
                dosage: true,
                }
            },
            user: {
                select: {
                id: true,
                name: true
                }
            }
            }
        });

        const prescriptions = prescriptionsResponse.map((prescription) => {
            return {
                id: prescription.id,
                name: prescription.user.name,
                note: prescription.notes,
                frequency: prescription.frequencyHours,
                startDate: prescription.startDate,
                endDate: prescription.endDate,
                patient: {
                    id: prescription.user.id,
                    name: prescription.user.name
                },
                medicine: {
                    id: prescription.medicine.id,
                    name: prescription.medicine.name,
                    useCase: prescription.medicine.useCase,
                    dosage: prescription.medicine.dosage
                }
            }
        })

        return {
            prescriptions
        };
    });
};
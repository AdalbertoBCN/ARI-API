import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import { z } from "zod";
import { userPermission } from "../../../middlewares/user-permission";

export const getPrescriptionsRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/prescriptions/:userId/:patientId",{ 
        preHandler: userPermission,
        schema:{
            response:{
                200: z.object({
                    prescriptions: z.array(z.object({
                        id: z.number(),
                        medicineId: z.number(),
                        userId: z.number(),
                        status: z.boolean()
                    }))
                }).describe("Lista de prescrições")
            },
            tags: ["Prescrição"],
            summary: "Listar prescrições",
            description: "Esta rota retorna uma lista de prescrições cadastradas no banco de dados."
        }
    }, async () => {
        const prescriptions = await prisma.prescriptions.findMany({
            where:{
                status: true
            }
        });

        return {
            prescriptions
        };
    });
};
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
    }, async (req) => {

        const { patientId } = req.params

        const prescriptions = await prisma.prescriptions.findMany({
            where:{
                status: true,
                userId: patientId
            }
        });

        return {
            prescriptions
        };
    });
};
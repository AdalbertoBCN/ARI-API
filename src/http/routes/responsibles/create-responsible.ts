import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "../../../middlewares/auth-user-token";
import { userPermission } from "../../../middlewares/user-permission";

export const createResponsibleRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/responsible", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                patientId: z.coerce.number().describe("Id do paciente"),
                userId: z.coerce.number().describe("Id do responsável"),
            }),
            response: {
                200: z.object({
                    message: z.string()
                }).describe("Responsável criado com sucesso")
            },
            tags:["Responsável"],
            summary: 'Criar um responsável',
            description: 'Esta rota criar um responsável no banco de dados.',
        }
    }, async (req) => {
        const { patientId, userId } = req.body;

        await prisma.patients_responsibles.create({
            data: {
                patientId: patientId,
                responsibleId: userId
            }
        });

        return {
            message: "Responsável criado com sucesso"
        };
    });
};
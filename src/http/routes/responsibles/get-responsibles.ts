import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import { z } from "zod";
import { userPermission } from "../../../middlewares/user-permission";
import { authToken } from "../../../middlewares/auth-user-token";

export const getResponsiblesRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/responsible/:patientId", {
        preHandler: [authToken, userPermission],
        schema: {
            params: z.object({
                patientId: z.coerce.number(),
            }), 
            response: {
                200: z.object({
                    responsibles: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string(),
                        })
                    ).describe("Lista de Responsáveis")
                }),
            },
            tags: ["Responsável"],
            summary: "Listar Responsáveis",
            description: "Esta rota retorna uma lista de responsáveis de um paciente.",
        },
    }, async (req) => {
        const { patientId } = req.params;

        // Busca as responsabilidades e mapeia apenas {id, name}
        const responsibles = await prisma.patients_responsibles.findMany({
            where: {
                patientId,
            },
            include: {
                responsible: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Extraindo apenas { id, name } de cada responsável
        const result = responsibles.map(r => ({
            id: r.responsible.id,
            name: r.responsible.name,
            email: r.responsible.email,
        }));

        return { responsibles: result };
    });
};

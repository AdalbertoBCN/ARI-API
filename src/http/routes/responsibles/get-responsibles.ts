import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import { z } from "zod";
import { userPermission } from "../../../middlewares/user-permission";

export const getResponsiblesRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/responsible/:userId/:patientId", {
        preHandler: userPermission,
        schema: {
            params: z.object({
                userId: z.coerce.number(),
                patientId: z.coerce.number(),
            }),
            response: {
                200: z.object({
                    responsibles: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                        })
                    ).describe("Lista de Responsáveis")
                }),
            },
            tags: ["Responsáveis"],
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
                    },
                },
            },
        });

        // Extraindo apenas { id, name } de cada responsável
        const result = responsibles.map(r => ({
            id: r.responsible.id,
            name: r.responsible.name,
        }));

        return { responsibles: result };
    });
};

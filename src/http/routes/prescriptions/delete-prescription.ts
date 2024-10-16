import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";

export const deletePrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/prescriptions/:id", {
        preHandler: [authToken, userPermission],
        schema: {
            params:z.object({
                id: z.coerce.number()
            }),
            response:{
                200: z.object({
                    message: z.string()
                }).describe("Prescrição deletada com sucesso")
            },
            tags:["Prescrição"],
            summary: 'Deletar uma prescrição',
            description: 'Esta rota deleta uma prescrição do banco de dados.',
        }
    }, async (req) => {
        const { id } = req.params;

        await prisma.prescriptions.update({
            where: { id },
            data: {
                status: false
            }
        });;

        return {
            message: "Prescrição deletada com sucesso"
        };
    });
};
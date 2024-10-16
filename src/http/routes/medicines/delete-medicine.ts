import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { authToken } from "@middleware/auth-user-token";
import { userPermission } from "@middleware/user-permission";

export const deleteMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/medicines", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                id: z.coerce.number().describe("Identificador do medicamento a ser deletado"),
            }),
            response:{
                200: z.object({
                    message: z.string()
                }).describe("Medicamento deletado com sucesso")
            },
            tags:["Medicamento"],
            summary: 'Deletar um medicamento',
            description: 'Esta rota deleta um medicamento do banco de dados.',
        }
    }, async (req) => {
        const { id } = req.body;

        await prisma.medicines.update({
            where: { id },
            data: {
                status: false
            }
        });;

        return {
            message: "Medicamento deletado com sucesso"
        };
    });
};
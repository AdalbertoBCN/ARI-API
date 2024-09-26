import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const deletePrescriptionRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/prescriptions", {
        schema: {
            body: z.object({
                id: z.coerce.number().describe("Identificador da prescrição a ser deletada"),
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
        const { id } = req.body;

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
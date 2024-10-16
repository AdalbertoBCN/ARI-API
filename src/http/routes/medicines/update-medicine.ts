import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { userPermission } from "@middleware/user-permission";
import { authToken } from "@middleware/auth-user-token";

export const updateMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.put("/medicines", {
        preHandler: [authToken, userPermission],
        schema: {
            body: z.object({
                id: z.coerce.number().describe("ID do medicamento"),
                name: z.string().optional().describe("Nome do medicamento"),
                useCase: z.string().optional().describe("Finalidade do medicamento"),
                dosage: z.string().optional().describe("Dosagem do medicamento"),
                status: z.boolean().optional().describe("Status do medicamento"),
            }),
            response: {
                201: z.object({
                    message: z.string()
                }).describe("Medicamento atualizado com sucesso")
            },
            tags:["Medicamento"],
            summary: 'Atualizar um medicamento',
            description: 'Esta rota atualiza um medicamento no banco de dados.',
        }
    }, async (req) => {
        const { id, name, useCase, dosage, status } = req.body;

        await prisma.medicines.update({
            where: { id },
            data: {
                name,
                useCase,
                dosage,
                status
            }
        });;
        
        return {
            message: "Medicamento atualizado com sucesso"
        };
    });
};
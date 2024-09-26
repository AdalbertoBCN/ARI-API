import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";

export const createMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/medicines", {
        schema: {
            body: z.object({
                name: z.string().describe("Nome do medicamento"),
                useCase: z.string().describe("Para que serve o medicamento"),
                dosage: z.string().describe("Dosagem do medicamento"),
            }),
            response: {
                200: z.object({
                    message: z.string()
                }).describe("Medicamento criado com sucesso")
            },
            tags:["Medicamento"],
            summary: 'Criar um medicamento',
            description: 'Esta rota cria um medicamento no banco de dados.',
        }
    }, async (req) => {
        const { name, useCase, dosage } = req.body;

        await prisma.medicines.create({
            data: {
                name,
                useCase,
                dosage
            }
        });

        return {
            message: "Medicamento criado com sucesso"
        };
    });
};
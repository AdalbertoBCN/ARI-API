import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
export const getMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/medicines",{
        schema:{
            response:{
                200: z.object({
                    medicines: z.array(z.object({
                        id: z.number(),
                        name: z.string(),
                        useCase: z.string(),
                        dosage: z.string(),
                        status: z.boolean()
                    }))
                }).describe("Lista de medicamentos")
            },
            tags: ["Medicamento"],
            summary: "Listar medicamentos",
            description: "Esta rota retorna uma lista de medicamentos cadastrados no banco de dados."
        }
    },async () => {
        const medicines = await prisma.medicines.findMany({
            where:{
                status: true
            }
        });

        return {
            medicines
        };
    });
};
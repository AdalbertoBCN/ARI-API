import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";
import z from "zod";
import { userPermission } from "@middleware/user-permission";
import { authToken } from "@middleware/auth-user-token";
export const getMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/medicines",{
        preHandler: [authToken],
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
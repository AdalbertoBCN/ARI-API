import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";

export const getMedicineRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/medicines", async () => {
        const medicines = await prisma.medicines.findMany();

        return {
            medicines
        };
    });
};
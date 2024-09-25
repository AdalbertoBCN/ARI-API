import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../prisma";

export const getPrescriptionsRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/prescriptions", async () => {
        const prescriptions = await prisma.prescriptions.findMany();

        return {
            prescriptions
        };
    });
};
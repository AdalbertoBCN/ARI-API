import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';

export const getUsersRoute: FastifyPluginAsyncZod = async function (app) {
    app.get("/users", async () => {
        const users = await prisma.users.findMany();

        return {
            users
        }
    })
};
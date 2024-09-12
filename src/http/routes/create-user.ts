import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../prisma';

export const getUsersRoute: FastifyPluginAsyncZod = async function (app) {
    await app.get("/users", async (req, res) => {
        const users = await prisma.users.findMany();
    
        return {
            users
        }
    })
};
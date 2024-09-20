import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';

export const updateUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.put("/users", {
        schema: {
            body: z.object({
                id: z.coerce.number(),
                name: z.string().optional(),
                email: z.string().email().optional(),
                password: z.string().optional(),
                birthDate: z.coerce.date().optional(),
            }),
        }
    }, async (req) => {
        const { id, name, email, password, birthDate } = req.body

        await prisma.users.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password,
                birthDate
            }
        });
    })
};
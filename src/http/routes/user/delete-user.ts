import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';

export const deleteUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.delete("/users", {
        schema: {
            body: z.object({
                id: z.coerce.number()
            }),
        }
    }, async (req) => {
        const { id } = req.body

        await prisma.users.update({
            where: {
                id
            },
            data: {
                status: false,
            }
        });
    })
};
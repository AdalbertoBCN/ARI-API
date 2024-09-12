import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../prisma';

export const createUserRoutes: FastifyPluginAsyncZod = async function (app) {
    await app.post("/users",{
        schema:{
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string(),
                birthDate: z.coerce.date(),
            }),
        }
    },async (req, res) => {
        const {name, email, password, birthDate} = req.body
    
        await prisma.users.create({
            data: {
                name,
                email,
                password,
                birthDate,
            }
        });
    })
};
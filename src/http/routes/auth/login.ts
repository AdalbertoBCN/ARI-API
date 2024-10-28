import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import { AES, enc } from "crypto-js"
import { env } from '../../../env';
import { generateToken } from '../../../config/jwt';
import { StatusCodes } from 'http-status-codes';
import { decrypt } from '../../../lib/crypto';

export const loginUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/login", {
        schema: {
            body: z.object({
                email: z.string().email().describe('E-mail do usuário'),
                password: z.string().describe('Senha do usuário'),
            }),
            response: {
                [StatusCodes.OK]: z.object({
                    message: z.string(),
                    token: z.string()
                }).describe('Esquema de resposta bem-sucedida'),
                [StatusCodes.NOT_FOUND]: z.string().describe('Usuário não encontrado'),
                [StatusCodes.UNAUTHORIZED]: z.string().describe('Usuário não encontrado')
            },
            tags: ['Autenticação'],
            summary: "Login de usuário",
            description: "Realiza o login de um usuário com jwt",
        }
    }, async (req, res) => {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({
            where:{
                email
            }
        })
        
        if (!user || password !== decrypt(user.password)) {
            return res.status(
                StatusCodes.NOT_FOUND
            ).send("Usuário não encontrado");
        }
      
        const token = generateToken(user.id);

        return res.status(
            StatusCodes.OK
        ).send({
            message: 'Usuário autenticado com sucesso',
            token
        })
    });
};

// src/routes/user/create-user.ts

import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../../prisma';
import { AES, enc } from "crypto-js"
import { env } from '../../../env';
import { generateToken } from '../../../config/jwt';

export const loginUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/login", {
        schema: {
            body: z.object({
                email: z.string().email().describe('E-mail do usuário'),
                password: z.string().describe('Senha do usuário'),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                    token: z.string()
                }).describe('Esquema de resposta bem-sucedida'),
                404: z.string().describe('Usuário não encontrado'),
                401: z.string().describe('Usuário não encontrado')
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

        if(!user){
            return res.status(404).send("Usuário não encontrado")
        }

        const encryptedPassword = AES.decrypt(password, env.CRYPTO_SECRET).toString(enc.Utf8);

        if (!user || encryptedPassword !== user.password) {
            return res.status(401).send('Credenciais inválidas');
        }
      
        const token = generateToken(user.id);

        return {
            message: "Usuário criado com sucesso!",
            token
        }
    });
};

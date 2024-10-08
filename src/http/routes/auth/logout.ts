import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { addTokenInBlackList } from '../../../config/jwt';

export const logoutUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.post("/logout", {
        schema: {
            tags: ['Autenticação'],
            summary: 'Deslogar usuário',
            description: 'Desloga o usuário da aplicação',
        }
    }, async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return {
                message: "Token não informado"
            }
        }

        addTokenInBlackList(token);

        return {
            message: "Usuário deslogado com sucesso!",
        }
    });
};

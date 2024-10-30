import { authToken } from '@middleware/auth-user-token';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../../../config/jwt';

export const logedUserRoutes: FastifyPluginAsyncZod = async function (app) {
    app.get("/loged",{
        preHandler: [authToken],
    }, async (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1] as string;

        const { id } = verifyToken(token);

        return res.status(StatusCodes.OK).send({ id, message: 'Usuário logado' });
    });
};

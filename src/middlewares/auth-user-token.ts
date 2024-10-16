import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../config/jwt';
import { JwtPayload } from 'jsonwebtoken';

export const authToken = async (
    req: FastifyRequest & { user?: string | JwtPayload },
    res: FastifyReply,
    done: (err?: Error) => void
  ): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
  
    if (!token) {
      return res.status(401).send({ message: 'Token não fornecido' });
    }
  
    try {
      const user = verifyToken(token);

      req.user = user;
      
    } catch (error) {
      return res.status(403).send({ message: 'Token inválido' });
    }
  
    done();
  };
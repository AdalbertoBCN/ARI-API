import jwt from 'jsonwebtoken';
import { env } from '../env';

export const blacklist = new Set<string>();

export const generateToken = (id:number) => {
return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '1h' });
}

export const verifyToken = (token:string) => {
    if(blacklist.has(token)){
        throw new Error('Token inválido');
    }

    return jwt.verify(token, env.JWT_SECRET) as { id:number };
}

export const addTokenInBlackList = (token:string) => {
   blacklist.add(token);
}